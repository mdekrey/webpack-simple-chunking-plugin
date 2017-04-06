A chunking plugin that simply makes sense.

# Installation

This plugin is not yet registered on npm.

# Documentation

Yet to be completed.

# Examples

Create a vendor chunk, using node_modules in all chunks except the `polyfills` chunk:

    var {SimpleChunkPlugin} = require('webpack-simple-chunking-plugin');
    var {createVendorChunk} = require('webpack-simple-chunking-plugin/lib/examples/vendorChunk');

    module.exports = {
      plugins: [
        new SimpleChunkPlugin(createVendorChunk('polyfills')),
      ]
    ]

Create a commons chunk from modules in at least 2 chunks and guarantee it is loaded when your 'app' chunk loads:

    var {SimpleChunkPlugin} = require('webpack-simple-chunking-plugin');
    var {createCommonChunk} = require('webpack-simple-chunking-plugin/lib/examples/minChunks');

    module.exports = {
      plugins: [
        new SimpleChunkPlugin(api => {
            const commons = createCommonChunk(2, false, 'commons')(api)

            const chunks = api.chunkNameMap();
            api.addChunkAsParent(commons, [chunks.get('app')]);
        }),
      ]
    ]

You can add multiple of these plugins back-to-back, or write your own logic with the api provided.
