A chunking plugin that simply makes sense.

This is largely adapted from Tobias Koppers's (@sokra) CommonsChunkPlugin.
Thanks to him for making such a wonderful MIT-sourced bit of code!

This plugin gives access to the capabilities of webpack's chunking engine...
along with a powerful and concise api. As a result, there are a number of ways
to shoot yourself in the foot, so as always with programming, be careful with
what you do and test thoroughly.

# Installation

This plugin is not yet registered on npm.

# Documentation

Yet to be completed. However, it is built out using TypeScript, so if that's
your thing, feel free to read the source code.

# Examples

Create a vendor chunk, using node_modules in all chunks except the `polyfills` chunk:

    var {SimpleChunkPlugin} = require('webpack-simple-chunking-plugin');
    var {createVendorChunk} = require('webpack-simple-chunking-plugin/lib/examples/vendorChunk');

    module.exports = {
      plugins: [
        new SimpleChunkPlugin(createVendorChunk('polyfills')),
      ]
    ]

Create a commons chunk from modules in at least 2 chunks and prepare it to be loaded with your 'app' entry chunk:

    var {SimpleChunkPlugin} = require('webpack-simple-chunking-plugin');
    var {createCommonChunk} = require('webpack-simple-chunking-plugin/lib/examples/minChunks');

    module.exports = {
      plugins: [
        new SimpleChunkPlugin(api => {
            const commons = createCommonChunk(2, false, 'commons')(api)
            api.addChunkAsParent(commons, this.chunks.filter(chunk => chunk.name === 'app'));
        }),
      ]
    ]

You can add multiple of these plugins back-to-back, or write your own logic with the api provided.
