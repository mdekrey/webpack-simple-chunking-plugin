
import { Module } from 'webpack'
import { Chunk, Compilation } from './types'

export class ChunkUtilityApi {
    constructor(public chunks: Chunk[], private compilation: Compilation) {
    }

    chunkNameMap(): Map<string, Chunk> {
        return this.chunks.reduce((map, chunk) => {
            if (chunk.name) {
                map.set(chunk.name, chunk);
            }
            return map;
        }, new Map<string, Chunk>());
    }

    addChunk(chunkName?: string) {
        const result = this.compilation.addChunk(chunkName);
        return result;
    }

    addModulesToChunk(modules: Iterable<Module>, targetChunk: Chunk) {
        for (const module of modules) {
            targetChunk.addModule(module);
            module.addChunk(targetChunk);
        }
    }

    removeModulesFromChunks(modules: ReadonlyArray<Module>, chunks: Iterable<Chunk>) {
        return modules.reduce((set, module) => {
            for (const chunk of chunks) {
                // removeChunk returns true if the chunk was contained and succesfully removed
                // false if the module did not have a connection to the chunk in question
                if (module.removeChunk(chunk)) {
                    set.add(chunk);
                }
            }
            return set;
        }, new Set<Chunk>());
    }

    addChunkAsParent(parent: Chunk, children: Iterable<Chunk>) {
        const wasAsync = this.isAsync(parent);
        let childrenAsync = true;
        for (const child of children) {
            if (!this.isAsync(child)) {
                childrenAsync = false;
                break;
            }
        }
        for (const chunk of children) {
            // set commonChunk as a new parent
            chunk.addParent(parent);
            // add chunk to commonChunk
            parent.addChunk(chunk);

            for (const entrypoint of chunk.entrypoints) {
                entrypoint.insertChunk(parent, chunk);
            }
        }
        if (wasAsync && !childrenAsync) {
            this.makeSync(parent);
        }
    }

    moveAllBlocksToChunk(chunks: Iterable<Chunk>, targetChunk: Chunk) {
        for (const chunk of chunks) {
            for (const block of chunk.blocks) {
                block.chunks.unshift(targetChunk);
                targetChunk.addBlock(block);
            }
        }
    }

    createChunkFrom(chunks: ReadonlyArray<Chunk>, modules: ReadonlyArray<Module>, chunkName?: string): Chunk {
        const commons = this.addChunk(chunkName);
        this.addModulesToChunk(modules, commons);
        const affectedChunks = this.removeModulesFromChunks(modules, chunks.filter(chunk => chunk !== commons));
        this.addChunkAsParent(commons, affectedChunks);

        if (this.isAsync(commons)) {
            // causes chunk to be loaded async at the same time as its new children
            this.moveAllBlocksToChunk(affectedChunks, commons);
        }
        return commons;
    }

    isAsync(chunk: Chunk) {
        if (chunk.entrypoints.length > 0) {
            return false;
        }

        for (const child of chunk.chunks) {
            if (!this.isAsync(child)) {
                return false;
            }
        }
        return true;
    }

    makeSync(chunk: Chunk) {
        chunk.blocks.splice(0);
    }
}
