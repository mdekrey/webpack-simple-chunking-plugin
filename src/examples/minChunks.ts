import { ChunkUtilityApi } from '../index';
import { Chunk } from '../types';
import { Module } from 'webpack';

export const createCommonChunk = (minCount: number, asyncOnly: boolean, name?: string) => (api: ChunkUtilityApi): Chunk => {
    const moduleUseCounts =
        api.chunks.filter(chunk => asyncOnly ? chunk.entrypoints.length === 0 : true).reduce((map, chunk) => {
            for (const module of chunk.modules) {
                const count = map.has(module) ? map.get(module)! : 0;
                map.set(module, count + 1);
            }
            return map;
        }, new Map<Module, number>())

    const commonModules = Array.from(moduleUseCounts)
        .filter(([_module, count]) => count >= minCount)
        .map(([module]) => module);

    const commons = api.addChunk(name);
    api.addModulesToChunk(commonModules, commons);
    const affectedChunks = api.removeModulesFromChunks(commonModules, api.chunks.filter(chunk => chunk !== commons));
    api.addChunkAsParent(commons, affectedChunks);
    return commons
}
