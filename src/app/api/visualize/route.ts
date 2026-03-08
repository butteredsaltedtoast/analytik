import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";

export async function POST(request: NextRequest) {
    try {

        const body = await request.json();
        const fileContent = body.fileContent;
        const fileName = body.fileName;

        if(!fileContent || typeof fileContent !== "string" || fileContent.trim() === "") {
            return NextResponse.json({ error: "file content is required and must be a nonempty string." }, { status: 400 });
        }

        if(!fileName || typeof fileName !== "string" || fileName.trim() === "") {
            return NextResponse.json({ error: "file name is required and must be a nonempty string." }, { status: 400 });
        }

        const scriptPath = path.join(process.cwd(), "scripts", "visualize.py");
        const input = JSON.stringify({ fileContent, fileName });

        const result = await new Promise((resolve, reject) => {

            const proc = execFile(
                process.platform === "win32" ? "python" : "python3",
                [scriptPath],
                { maxBuffer: 50 * 1024 * 1024, timeout: 30000 },
                (error, stdout, stderr) => {

                    if(error)
                    {
                        console.error("python error:", error);
                        reject(new Error(stderr || error.message || "Unknown error"));
                        return;
                    }
                    resolve(stdout);


                }
            );

            proc.stdin?.write(input);
            proc.stdin?.end();
            
        });

        const parsed = JSON.parse(result as string);
        return NextResponse.json(parsed);


    } catch (error) {
        console.error("Visualization error:", error);
        return NextResponse.json({ error: "Failed to generate visualizations" }, { status: 500 });
    }
}