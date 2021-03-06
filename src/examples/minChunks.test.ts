import { expect } from "chai";

import path = require("path");

import { SimpleChunkPlugin } from "../index";
import { createCommonChunk } from "./minChunks";
import { ICompilerResults, simpleCompile } from "./webpackCompiler";

describe("minChunks example", () => {
    let compilerResults: ICompilerResults;

    before((done) => {
        simpleCompile(
            { example: path.resolve(__dirname, "./minChunks.example.js") },
            [
                new SimpleChunkPlugin(createCommonChunk(2, true, "commons")),
            ],
            results => {
                compilerResults = results;
                done();
            },
        );
    });

    it("produces an example chunk, a common chunk, and two other chunks", () => {
        expect(compilerResults.chunks.length).to.equal(4);
        expect(compilerResults.chunks.find(chunk => chunk.name === "example")).not.to.be.an("undefined");
        expect(compilerResults.chunks.find(chunk => chunk.name === "commons")).not.to.be.an("undefined");
    });

    it("produces files for the chunks", () => {
        for (const chunk of compilerResults.chunks) {
            expect(compilerResults.fs.existsSync("/" + chunk.files[0])).to.be.true;
        }
    });

});
