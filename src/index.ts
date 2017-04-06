
import { Compiler, Plugin } from 'webpack'
import { Chunk, Compilation } from './types'
import { ChunkUtilityApi } from './api'

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
            });
        });
    }

}
