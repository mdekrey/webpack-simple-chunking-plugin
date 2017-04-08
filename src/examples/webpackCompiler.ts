import webpack = require("webpack");
import { Chunk } from "../types";
import MemoryFS = require("memory-fs");
import { SimpleChunkPlugin } from "../index";

export interface ICompilerResults {
    fs: MemoryFS;
    chunks: Chunk[];
}

export const simpleCompile = (
    entry: webpack.Configuration["entry"],
    plugins: webpack.Plugin[],
    completed: (results: ICompilerResults) => void,
) => {
    const fs = new MemoryFS();
    let chunks: Chunk[];
    const webpackCompiler = webpack({
        entry,
        plugins: [
            ...plugins,
            new SimpleChunkPlugin(api => chunks = api.chunks),
        ],
        output: {
            path: "/",
        },
    });
    webpackCompiler.outputFileSystem = fs;
    webpackCompiler.run(() => completed({ fs, chunks }));
};
