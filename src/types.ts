import * as Tapable from "tapable";
import { Module } from "webpack";

/** Specifies  */
export declare class Block {
    chunks: Chunk[];
    parent: Module;
}

export declare class Entrypoint {
    name: string;
    chunks: ReadonlyArray<Chunk>;

    insertChunk(commonChunk: Chunk, originalChunk: Chunk): void;
}

export declare class Chunk {
    name: string;
    filenameTemplate: string;
    files: string[];
    chunks: ReadonlyArray<Chunk>;
    parents: ReadonlyArray<Chunk>;
    chunkReason: string;
    extraAsync: boolean;
    modules: ReadonlyArray<Module>;
    blocks: Block[];
    entrypoints: ReadonlyArray<Entrypoint>;
    origins: { reasons?: string[]; }[];

    addBlock(block: Block): void;
    addModule(module: Module): void;
    addChunk(chunk: Chunk): void;
    addParent(chunk: Chunk): void;

    hasRuntime(): boolean;
}

export declare class Compilation extends Tapable {
    errors: Error[];

    addChunk(chunkName?: string): Chunk;
}

declare module "webpack" {
    interface BaseModule {
        resource?: string;
        chunkCondition(chunk: Chunk): boolean;
        size(): number;

        addChunk(chunk: Chunk): void;
        removeChunk(chunk: Chunk): void;
    }
}
