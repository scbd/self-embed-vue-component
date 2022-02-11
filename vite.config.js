import { defineConfig        } from 'vite'
import { terser              } from 'rollup-plugin-terser'
import { name, cdn, version, license, author, repository, homepage, readme, description } from './package.json'

const year   = new Date().getFullYear()

const desc = !description? '' :
  `
* ${description}
*`

const readMe = readme.includes('ERROR:')? '' : readme

const link = (homepage || readMe)? `
* @link ${homepage ||readMe}` : ''



const repo = repository? `
* @source ${repository}`: ''

const cdnLink = cdn? `
* @cdn ${cdn}`: ''

const banner = `
/*SCBD***************************************************!
* ${name} ${version}
* ${desc}${link}${repo}${cdnLink}
* @copyright (c) ${year} ${author.name || ''}
* @license ${license}
* 
* published: ${new Date()}
*********************************************************/

`

export default defineConfig({
    logLevel : 'info',
    build    : {
                  emptyOutDir: true, minify: false, sourcemap: false,
                  lib      : { 
                                formats  : ['es', 'umd', 'cjs'],
                                entry    : 'src/index.mjs',
                                name     : 'SelfEmbeddingComponent',
                                fileName : (format) => (format === 'es')? `index.min.js` : `${format}/index.min.js`
                              }, 
                  // lib build as opposed to app build
                  external: [ 'json5', 'camel-case', 'param-case', 'pascal-case' ],
                  rollupOptions: {
                    // make sure to externalize deps that shouldn't be bundled
                    // into your library
                    output: {
                      banner,
                      exports: 'named',
                      // Provide global variables to use in the UMD build
                      // for externalized deps
                      globals: { JSON5: 'json5', camelCase: 'camel-case', paramCase: 'param-case', pascalCase: 'pascal-case',}
                    },
                    plugins: [terser()]
                  }
                }
  })

