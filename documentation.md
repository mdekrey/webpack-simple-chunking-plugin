## Classes

<dl>
<dt><a href="#ChunkUtilityApi">ChunkUtilityApi</a></dt>
<dd><p>The main utility API for chunking</p>
</dd>
<dt><a href="#SimpleChunkPlugin">SimpleChunkPlugin</a></dt>
<dd></dd>
</dl>

<a name="ChunkUtilityApi"></a>

## ChunkUtilityApi
The main utility API for chunking

**Kind**: global class  

* [ChunkUtilityApi](#ChunkUtilityApi)
    * [.chunkNameMap()](#ChunkUtilityApi+chunkNameMap)
    * [.addChunk(chunkName)](#ChunkUtilityApi+addChunk) ⇒
    * [.addModulesToChunk(modules, targetChunk)](#ChunkUtilityApi+addModulesToChunk)
    * [.removeModulesFromChunks(modules, chunks)](#ChunkUtilityApi+removeModulesFromChunks) ⇒
    * [.addChunkAsParent(parent, children)](#ChunkUtilityApi+addChunkAsParent)
    * [.moveAllBlocksToChunk(chunks, targetChunk)](#ChunkUtilityApi+moveAllBlocksToChunk)
    * [.createChunkFrom(chunks, modules, chunkName)](#ChunkUtilityApi+createChunkFrom) ⇒
    * [.isAsync(chunk)](#ChunkUtilityApi+isAsync) ⇒
    * [.makeSync(chunk)](#ChunkUtilityApi+makeSync)

<a name="ChunkUtilityApi+chunkNameMap"></a>

### chunkUtilityApi.chunkNameMap()
Creates a Map from the names of the chunks to the chunks. This is createdonce.

**Kind**: instance method of <code>[ChunkUtilityApi](#ChunkUtilityApi)</code>  
<a name="ChunkUtilityApi+addChunk"></a>

### chunkUtilityApi.addChunk(chunkName) ⇒
Creates and adds a chunk

**Kind**: instance method of <code>[ChunkUtilityApi](#ChunkUtilityApi)</code>  
**Returns**: The new chunk  

| Param | Description |
| --- | --- |
| chunkName | Optional. The name of the chunk. |

<a name="ChunkUtilityApi+addModulesToChunk"></a>

### chunkUtilityApi.addModulesToChunk(modules, targetChunk)
Adds the given modules to the chunk.

**Kind**: instance method of <code>[ChunkUtilityApi](#ChunkUtilityApi)</code>  

| Param | Description |
| --- | --- |
| modules | The modules to add to the chunk |
| targetChunk | The chunk that will receive the modules. |

<a name="ChunkUtilityApi+removeModulesFromChunks"></a>

### chunkUtilityApi.removeModulesFromChunks(modules, chunks) ⇒
Removes the given modules from all the given chunks.

**Kind**: instance method of <code>[ChunkUtilityApi](#ChunkUtilityApi)</code>  
**Returns**: A Set of the chunks that were actually affected.  

| Param | Description |
| --- | --- |
| modules | The modules to remove from the chunks |
| chunks | The chunks that should no longer contain the modules. |

<a name="ChunkUtilityApi+addChunkAsParent"></a>

### chunkUtilityApi.addChunkAsParent(parent, children)
Adds a chunk as the parent of the given chunks.

**Kind**: instance method of <code>[ChunkUtilityApi](#ChunkUtilityApi)</code>  

| Param | Description |
| --- | --- |
| parent | The new parent. |
| children | The child chunks. |

<a name="ChunkUtilityApi+moveAllBlocksToChunk"></a>

### chunkUtilityApi.moveAllBlocksToChunk(chunks, targetChunk)
Moves the blocks from the given chunks to the target chunk.Unfortunately, I'm not 100% clear on what a block is. From what I cantell, it is the target of code-splitting async requests. Moving blocksfrom an async chunk to a commons chunk causes the commons chunk and theasync chunk to be requested at the same time.

**Kind**: instance method of <code>[ChunkUtilityApi](#ChunkUtilityApi)</code>  

| Param | Description |
| --- | --- |
| chunks | The chunks containing the blocks |
| targetChunk | The chunk to receive the blocks |

<a name="ChunkUtilityApi+createChunkFrom"></a>

### chunkUtilityApi.createChunkFrom(chunks, modules, chunkName) ⇒
Creates a chunk from given child chunks, moving specified modules. If achild does not contain any of the specified modules, they will not beadded as a parent of the chunk.If the new chunk is completely async, it will receive all blocks from itschildren. FIXME - in non-SPA situations, this may not be the correctbehavior.

**Kind**: instance method of <code>[ChunkUtilityApi](#ChunkUtilityApi)</code>  
**Returns**: The new chunk  

| Param | Description |
| --- | --- |
| chunks | The new child chunks. |
| modules | The modules to move from children to parent. |
| chunkName | The name of the new chunk. |

<a name="ChunkUtilityApi+isAsync"></a>

### chunkUtilityApi.isAsync(chunk) ⇒
Determines if the chunk and all of its children are async.FIXME - in non-SPA situations, this may not be the correct behavior.

**Kind**: instance method of <code>[ChunkUtilityApi](#ChunkUtilityApi)</code>  
**Returns**: True only if the chunk and all of its children are async (haveno entry points). Otherwise, false.  

| Param | Description |
| --- | --- |
| chunk | The chunk to test |

<a name="ChunkUtilityApi+makeSync"></a>

### chunkUtilityApi.makeSync(chunk)
Makes a chunk synchronous.Clears out a chunk's blocks, without adding entry points, etc. This maynot be the best way to achieve this.

**Kind**: instance method of <code>[ChunkUtilityApi](#ChunkUtilityApi)</code>  

| Param | Description |
| --- | --- |
| chunk | The target chunk. |

<a name="SimpleChunkPlugin"></a>

## SimpleChunkPlugin
**Kind**: global class  
<a name="new_SimpleChunkPlugin_new"></a>

### new SimpleChunkPlugin(chunksCallback)
Creates a new simple chunk plugin


| Param | Description |
| --- | --- |
| chunksCallback | The callback that will receive the API |

