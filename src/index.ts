
import { Compiler, Module, Plugin } from 'webpack'
import { Chunk, Compilation } from './types'

let nextIdent = 0;
export class SimpleChunkPlugin implements Plugin {
    private chunksCallback: (api: ChunkUtilityApi) => void;
    private ident: string;

    constructor(chunksCallback: (api: ChunkUtilityApi) => void) {
        this.ident = __filename + (nextIdent++);
        this.chunksCallback = chunksCallback;
    }

    apply(compiler: Compiler): void {
        compiler.plugin('this-compilation', (compilation: Compilation) => {
            compilation.plugin(['optimize-chunks', 'optimize-extracted-chunks'], (chunks: Chunk[]) => {
                if (compilation[this.ident]) {
                    return;
                }
                compilation[this.ident] = true;

                this.chunksCallback(new ChunkUtilityApi(chunks, compilation));
                // console.log(chunks.map(chunk => ({
                //     name: chunk.name,
                //     // modules: chunk.modules.slice(0, 3).map(mod => mod.resource),
                //     entrypoints: chunk.entrypoints.map(p => p.name),
                //     blocks: chunk.blocks.length,
                //     hasRuntime: chunk.hasRuntime(),
                //     parents: chunk.parents.map(p => p.name),
                //     chunks: chunk.chunks.map(p => p.name),
                //     extraAsync: chunk.extraAsync,
                // })))
            });
        });
    }

}

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
        for (const chunk of children) {
            // set commonChunk as a new parent
            chunk.addParent(parent);
            // add chunk to commonChunk
            parent.addChunk(chunk);

            for (const entrypoint of chunk.entrypoints) {
                entrypoint.insertChunk(parent, chunk);
            }
        }
    }
}
