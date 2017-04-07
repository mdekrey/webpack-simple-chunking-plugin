
import { Compiler, Plugin } from 'webpack';
import { Chunk, Compilation } from './types';
import { ChunkUtilityApi } from './api';

let nextIdent = 0;
export class SimpleChunkPlugin implements Plugin {
    private ident: string;

    /**
     * Creates a new simple chunk plugin
     * @param chunksCallback The callback that will receive the API
     */
    constructor(
        private chunksCallback: (api: ChunkUtilityApi) => void,
    ) {
        this.ident = __filename + (nextIdent++);
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
