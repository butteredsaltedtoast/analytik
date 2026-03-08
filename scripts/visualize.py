import sys
import json
import io
import base64
import csv
import numpy
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot
from matplotlib.ticker import MaxNLocator

matplotlib.pyplot.rcParams.update({
    "figure.facecolor": "#030712",
    "axes.facecolor": "#111827",
    "axes.edgecolor": "#374151",
    "axes.labelcolor": "#d1d5db",
    "text.color": "#d1d5db",
    "xtick.color": "#9ca3af",
    "ytick.color": "#9ca3af",
    "grid.color": "#1f2937",
    "grid.linestyle": "--",
    "grid.alpha": 0.7,
    "legend.facecolor": "#1f2937",
    "legend.edgecolor": "#374151",
    "legend.labelcolor": "#d1d5db",
    "font.size": 11,
    "axes.titlesize": 13,
    "axes.titleweight": "bold",
})

COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

def parse_input(raw: str, file_name: str) -> list[dict]:
    if file_name.endswith(".json"):
        parsed = json.loads(raw)
        return parsed if isinstance(parsed, list) else [parsed]

    reader = csv.DictReader(io.StringIO(raw))
    rows = []

    for row in reader:
        converted = {}
        for k, v in row.items():
            k = k.strip()
            try:
                converted[k] = float(v.strip())
            except (ValueError, AttributeError):
                converted[k] = v.strip() if v else ""
        rows.append(converted)
    return rows

def get_columns(data: list[dict]) -> tuple[list[str], list[str]]:
    if not data:
        return [], []

    numeric = []
    categorical = []

    for key in data[0]:
        if all(isinstance(row.get(key), (int, float)) for row in data):
            numeric.append(key)
        else:
            categorical.append(key)

    return numeric, categorical

def compute_stats(data: list[dict], numeric_cols: list[str]) -> dict:
    stats = {}

    for col in numeric_cols:
        values = numpy.array([row[col] for row in data])
        stats[col] = {
            "n": len(values),
            "mean": round(float(numpy.mean(values)), 4),
            "std": round(float(numpy.std(values, ddof=1)), 4) if len(values) > 1 else 0,
            "min": round(float(numpy.min(values)), 4),
            "q25": round(float(numpy.percentile(values, 25)), 4),
            "median": round(float(numpy.median(values)), 4),
            "q75": round(float(numpy.percentile(values, 75)), 4),
            "max": round(float(numpy.max(values)), 4),
        }

    return stats

def fig_to_b64(fig: matplotlib.pyplot.Figure) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, bbox_inches="tight", pad_inches=0.3)
    matplotlib.pyplot.close(fig)
    buf.seek(0)
    return "data:image/png;base64," + base64.b64encode(buf.read()).decode()

def make_line_graph(data: list[dict], x_col: str, y_cols: list[str]) -> dict:
    fig, ax = matplotlib.pyplot.subplots(figsize=(8, 4.5))
    x = [row[x_col] for row in data]

    for i, y_col in enumerate(y_cols):
        y = [row[y_col] for row in data]
        ax.plot(x, y, marker="o", markersize=5, linewidth=2, color=COLORS[i % len(COLORS)], label=y_col)

    ax.set_xlabel(x_col)

    if len(y_cols) == 1:
        ax.set_ylabel(y_cols[0])

    ax.set_title(f"{", ".join(y_cols)} vs {x_col}")
    ax.legend()
    ax.grid(True)
    ax.xaxis.set_major_locator(MaxNLocator(integer=True, nbins=10))

    return {"title": f"{", ".join(y_cols)} vs {x_col}", "image": fig_to_b64(fig)}

def make_correlation_matrix(data: list[dict], numeric_cols: list[str]) -> dict | None:
    if len(numeric_cols) < 3:
        return None

    matrix = numpy.array([[row[c] for c in numeric_cols] for row in data])
    corr = numpy.corrcoef(matrix, rowvar=False)

    fig, ax = matplotlib.pyplot.subplots(figsize=(6, 5))
    im = ax.imshow(corr, cmap="RdBu_r", vmin=-1, vmax=1, aspect="auto")

    ax.set_xticks(numpy.arange(len(numeric_cols)))
    ax.set_yticks(numpy.arange(len(numeric_cols)))
    ax.set_xticklabels(numeric_cols, rotation=45, ha="right", fontsize=9)
    ax.set_yticklabels(numeric_cols, fontsize=9)

    for i in range(len(numeric_cols)):
        for j in range(len(numeric_cols)):
            text_color = "white" if abs(corr[i, j]) > 0.5 else "#d1d5db"
            ax.text(j, i, f"{corr[i, j]:.2f}", ha="center", va="center", color=text_color, fontsize=8, fontweight="bold")

    fig.colorbar(im, ax=ax, label="Pearson Correlation", shrink=0.8)
    ax.set_title("Correlation Matrix")

    return {"title": "Correlation Matrix", "image": fig_to_b64(fig)}

def make_distribution(data: list[dict], col: str) -> dict:
    values = numpy.array([row[col] for row in data])

    fig, ax = matplotlib.pyplot.subplots(figsize=(7, 4))
    ax.hist(values, bins=min(20, max(5, len(values) // 3)), color=COLORS[0], edgecolor="#1f2937", alpha=0.8)

    mean_val = numpy.mean(values)
    median_val = numpy.median(values)

    ax.axvline(mean_val, color=COLORS[2], linestyle="--", linewidth=1.5, label=f"Mean: {mean_val:.2f}")
    ax.axvline(median_val, color=COLORS[1], linestyle="-.", linewidth=1.5, label=f"Median: {median_val:.2f}")

    ax.set_xlabel(col)
    ax.set_ylabel("Count")
    ax.set_title(f"Distribution of {col}")

    ax.legend()
    ax.grid(True, axis="y")

    return {"title": f"Distribution of {col}", "image": fig_to_b64(fig)}

def make_scatter_with_regression(data: list[dict], x_col: str, y_col: str) -> dict:
    x = numpy.array([row[x_col] for row in data])
    y = numpy.array([row[y_col] for row in data])

    fig, ax = matplotlib.pyplot.subplots(figsize=(7, 5))
    ax.scatter(x, y, color=COLORS[0], s=50, alpha=0.8, edgecolors="#1f2937", linewidths=0.5)

    if len(x) >= 3:
        coeffs = numpy.polyfit(x, y, 1)
        poly = numpy.poly1d(coeffs)
        x_line = numpy.linspace(x.min(), x.max(), 100)
        ax.plot(x_line, poly(x_line), color=COLORS[3], linewidth=1.5, linestyle="--", label=f"y = {coeffs[0]:.3f}x + {coeffs[1]:.3f}")

        ss_res = numpy.sum((y - poly(x)) ** 2)
        ss_tot = numpy.sum((y - numpy.mean(y)) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0
        ax.text(0.05, 0.95, f"$R^2$ = {r_squared:.4f}", transform=ax.transAxes, verticalalignment="top", bbox=dict(boxstyle="round,pad=0.3", facecolor="#1f2937", edgecolor="#374151"))

    ax.set_xlabel(x_col)
    ax.set_ylabel(y_col)
    ax.set_title(f"{y_col} vs {x_col}")
    ax.legend()
    ax.grid(True)

    return {"title": f"{y_col} vs {x_col}", "image": fig_to_b64(fig)}

def make_pairwise_scatter(data: list[dict], numeric_cols: list[str]) -> dict | None:
    if len(numeric_cols) < 3 or len(numeric_cols) > 6:
        return None

    fig, axes = matplotlib.pyplot.subplots(len(numeric_cols), len(numeric_cols), figsize=(2.5 * len(numeric_cols), 2.5 * len(numeric_cols)))

    for i in range(len(numeric_cols)):
        for j in range(len(numeric_cols)):
            ax = axes[i, j]

            x_vals = [row[numeric_cols[j]] for row in data]
            y_vals = [row[numeric_cols[i]] for row in data]

            if i == j:
                ax.hist(x_vals, bins=min(15, max(4, len(data) // 3)), color=COLORS[j % len(COLORS)], edgecolors="#1f2937", linewidths=0.3)
            else:
                ax.scatter(x_vals, y_vals, s=20, alpha=0.7, color=COLORS[j % len(COLORS)], edgecolors="#1f2937", linewidths=0.3)

            if i == len(numeric_cols) - 1:
                ax.set_xlabel(numeric_cols[j], fontsize=8)
            else:
                ax.set_xticklabels([])

            if j == 0:
                ax.set_ylabel(numeric_cols[i], fontsize=8)
            else:
                ax.set_yticklabels([])

            ax.tick_params(labelsize=7)

    fig.suptitle("Pairwise Relationships", y=1.02)
    fig.tight_layout()

    return {"title": "Pairwise Relationships", "image": fig_to_b64(fig)}

def main():
    raw_input = json.loads(sys.stdin.read())
    file_content = raw_input["fileContent"]
    file_name = raw_input["fileName"]

    data = parse_input(file_content, file_name)
    if not data:
        print(json.dumps({"charts": [], "stats": {}}))
        return

    numeric_cols, categorical_cols = get_columns(data)
    stats = compute_stats(data, numeric_cols)

    charts = []

    if len(numeric_cols) >= 2:
        charts.append(make_line_graph(data, numeric_cols[0], numeric_cols[1:]))

    if categorical_cols and numeric_cols:
        x_vals = [row[categorical_cols[0]] for row in data]
        try:
            [float(v) for v in x_vals]
            charts.append(make_line_graph(data, categorical_cols[0], numeric_cols[:3]))
        except (ValueError, TypeError):
            pass

    if len(numeric_cols) >= 2:
        charts.append(make_scatter_with_regression(data, numeric_cols[0], numeric_cols[1]))

    for col in numeric_cols[:4]:
        charts.append(make_distribution(data, col))

    corr = make_correlation_matrix(data, numeric_cols)
    if corr:
        charts.append(corr)

    pairwise = make_pairwise_scatter(data, numeric_cols)
    if pairwise:
        charts.append(pairwise)

    charts = [c for c in charts if c is not None]
    print(json.dumps({"charts": charts, "stats": stats}))

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        import traceback
        print(json.dumps({
            "error": str(e),
            "charts": [],
            "stats": {}
        }))
        sys.exit(0)
