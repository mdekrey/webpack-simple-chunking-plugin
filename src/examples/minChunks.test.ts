import MemoryFS = require("memory-fs");
import path = require("path");

import webpack = require("webpack");
import { expect } from "chai";
import { SimpleChunkPlugin } from "../index";
import { createCommonChunk } from "./minChunks";

describe("minChunks example", () => {
    const fs = new MemoryFS();
    let webpackCompiler: webpack.Compiler;
    let chunks: any[];

    before((done) => {
        webpackCompiler = webpack({
            entry: { example: path.resolve(__dirname, "./minChunks.example.js") },
            plugins: [
                new SimpleChunkPlugin(createCommonChunk(2, true, "commons")),
                new SimpleChunkPlugin(api => chunks = api.chunks),
            ],
            output: {
                path: "/",
            },
        });
        webpackCompiler.outputFileSystem = fs;
        webpackCompiler.run(done);
    });

    it("produces an example chunk, a common chunk, and two other chunks", () => {
        expect(chunks.length).to.equal(4);
        expect(chunks.find(chunk => chunk.name === "example")).not.to.be.an("undefined");
        expect(chunks.find(chunk => chunk.name === "commons")).not.to.be.an("undefined");
    });

    it("produces files for the chunks", () => {
        for (const chunk of chunks) {
            expect(fs.existsSync("/" + chunk.files[0])).to.be.true;
        }
    });

});
