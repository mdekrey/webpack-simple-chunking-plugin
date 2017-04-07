
import { Module } from 'webpack';
import { Chunk, Compilation } from './types';

/**
 * The main utility API for chunking
 */
export class ChunkUtilityApi {
    constructor(
        /**
         * A mutable array of the chunks directly from webpack.
         */
        public chunks: Chunk[],
        private compilation: Compilation,
    ) {
    }

    /**
     * Creates a Map from the names of the chunks to the chunks. This is created
     * once.
     */
    chunkNameMap(): Map<string, Chunk> {
        return this.chunks.reduce((map, chunk) => {
            if (chunk.name) {
                map.set(chunk.name, chunk);
            }
            return map;
        }, new Map<string, Chunk>());
    }

    /**
     * Creates and adds a chunk
     * @param chunkName Optional. The name of the chunk.
     * @returns The new chunk
     */
    addChunk(chunkName?: string) {
        const result = this.compilation.addChunk(chunkName);
        return result;
    }

    /**
     * Adds the given modules to the chunk.
     * @param modules The modules to add to the chunk
     * @param targetChunk The chunk that will receive the modules.
     */
    addModulesToChunk(modules: Iterable<Module>, targetChunk: Chunk) {
        for (const module of modules) {
            targetChunk.addModule(module);
            module.addChunk(targetChunk);
        }
    }

    /**
     * Removes the given modules from all the given chunks.
     * @param modules The modules to remove from the chunks
     * @param chunks The chunks that should no longer contain the modules.
     * @returns A Set of the chunks that were actually affected.
     */
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

    /**
     * Adds a chunk as the parent of the given chunks.
     * @param parent The new parent.
     * @param children The child chunks.
     */
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

    /**
     * Moves the blocks from the given chunks to the target chunk.
     *
     * Unfortunately, I'm not 100% clear on what a block is. From what I can
     * tell, it is the target of code-splitting async requests. Moving blocks
     * from an async chunk to a commons chunk causes the commons chunk and the
     * async chunk to be requested at the same time.
     * @param chunks The chunks containing the blocks
     * @param targetChunk The chunk to receive the blocks
     */
    moveAllBlocksToChunk(chunks: Iterable<Chunk>, targetChunk: Chunk) {
        for (const chunk of chunks) {
            for (const block of chunk.blocks) {
                block.chunks.unshift(targetChunk);
                targetChunk.addBlock(block);
            }
        }
    }

    /**
     * Creates a chunk from given child chunks, moving specified modules. If a
     * child does not contain any of the specified modules, they will not be
     * added as a parent of the chunk.
     *
     * If the new chunk is completely async, it will receive all blocks from its
     * children. FIXME - in non-SPA situations, this may not be the correct
     * behavior.
     * @param chunks The new child chunks.
     * @param modules The modules to move from children to parent.
     * @param chunkName The name of the new chunk.
     * @returns The new chunk
     */
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

    /**
     * Determines if the chunk and all of its children are async.
     *
     * FIXME - in non-SPA situations, this may not be the correct behavior.
     * @param chunk The chunk to test
     * @returns True only if the chunk and all of its children are async (have
     * no entry points). Otherwise, false.
     */
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

    /**
     * Makes a chunk synchronous.
     *
     * Clears out a chunk's blocks, without adding entry points, etc. This may
     * not be the best way to achieve this.
     * @param chunk The target chunk.
     */
    makeSync(chunk: Chunk) {
        chunk.blocks.splice(0);
    }
}
