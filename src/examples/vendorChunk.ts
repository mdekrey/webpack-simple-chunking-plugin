import { ChunkUtilityApi } from '../index';
import { Chunk } from '../types';
import { Module } from 'webpack';

export const createVendorChunk = (...excludingChunkNames: string[]) => (api: ChunkUtilityApi) => {
    const chunks = api.chunkNameMap();
    const excludedChunks = excludingChunkNames.map(chunkName => chunks.get(chunkName)).filter(Boolean) as Chunk[];
    const otherChunks = api.chunks.filter(chunk => excludedChunks.indexOf(chunk) === -1);
    const vendorModules = Array.from(otherChunks.reduce((set, chunk) => {
        const modules = chunk.modules.filter(m => m.resource && /[\\/]node_modules[\\/]/.exec(m.resource));
        for (const module of modules) {
            set.add(module);
        }
        return set;
    }, new Set<Module>()));

    const vendor = api.addChunk('vendor');
    api.addModulesToChunk(vendorModules, vendor);
    const affectedChunks = api.removeModulesFromChunks(vendorModules, otherChunks);
    api.addChunkAsParent(vendor, affectedChunks);

    excludedChunks.forEach(chunk => {
        const maybeVendorChunks = api.removeModulesFromChunks(chunk.modules, [vendor]);
        api.addChunkAsParent(chunk, maybeVendorChunks);
    });
}
