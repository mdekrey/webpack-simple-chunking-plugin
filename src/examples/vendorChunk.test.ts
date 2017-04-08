import { expect } from "chai";

import path = require("path");

import { SimpleChunkPlugin } from "../index";
import { createVendorChunk } from "./vendorChunk";
import { ICompilerResults, simpleCompile } from "./webpackCompiler";

describe("vendor example", () => {
    let compilerResults: ICompilerResults;

    before((done) => {
        simpleCompile(
            { example: path.resolve(__dirname, "./vendorChunk.example.js") },
            [
                new SimpleChunkPlugin(createVendorChunk()),
            ],
            results => {
                compilerResults = results;
                done();
            },
        );
    });

    it("produces an example chunk, and a vendor chunk", () => {
        expect(compilerResults.chunks.length).to.equal(3);
        expect(compilerResults.chunks.find(chunk => chunk.name === "example")).not.to.be.an("undefined");
        expect(compilerResults.chunks.find(chunk => chunk.name === "vendor")).not.to.be.an("undefined");
    });

    it("produces files for the chunks", () => {
        for (const chunk of compilerResults.chunks) {
            expect(compilerResults.fs.existsSync("/" + chunk.files[0])).to.be.true;
        }
    });

});
