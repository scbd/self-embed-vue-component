import { camelCase, setPkg,  getCssUrl, getWidgetMountUrl, getEsShimsUrl, getImportMapUrl } from './util.mjs'
import   JSON5       from 'json5' //https://cdn.jsdelivr.net/npm/json5@2.2.0/dist/index.min.mjs

export default class {

  constructor(options = {},  widgetOptions = {}){
    window.esmsInitOptions = { shimMode: true }

    this.initGlobalVars(options, widgetOptions)
    this.initElements()
    this.loadEsShim()
    this.attrsAsOptions()

    this.loadImportMap()
    this.loadCss()
    this.loadWidgetMount()
  }

  initGlobalVars({ $el, callingImportMetaUrl='nothing', Package, css, cssDefaultUrl, esShimCdnUrl, importMapUrl, widgetMountUrl }, widgetOptions){
  
    const elSearch = document.querySelectorAll(`[src='${callingImportMetaUrl}']`)

    if(elSearch.length !== 1 && !$el) throw new Error('@scbd/self-embedding-component: more then one url loaded as modules without unique identifier appended as search param')

    this.callingImportMetaUrl = callingImportMetaUrl
    this.selfElement          = $el || elSearch[0]
    this.pkg                  = setPkg(Package, widgetOptions)
    this.esShimCdnUrl         = esShimCdnUrl    || getEsShimsUrl(this.pkg)
    this.cssDefaultUrl        = cssDefaultUrl   || getCssUrl(this.pkg, widgetOptions)
    this.css                  = Array.isArray(css)? [ ...css, this.cssDefaultUrl ] : [ this.cssDefaultUrl ]
    this.importMapUrl         = importMapUrl    || getImportMapUrl(this.pkg, widgetOptions)
    this.widgetMountUrl       = widgetMountUrl  || getWidgetMountUrl(this.pkg, widgetOptions)
  }

  createMountDiv(){
    const divTag     = document.createElement('div')
    const identifier = this.getIdentifierSearchParam()? `-${this.getIdentifierSearchParam()}` : ''

    divTag.id        = `mount-${this.pkg.pkgName}${identifier}`
  
    this.insertElement(divTag)
  }

  insertElement(el){
    this.parentNode.insertBefore(el, this.selfElement)
  }

  initElements () {
    
    if(!this.selfElement) this.selfElement = document.querySelector(`[src='${this.callingImportMetaUrl}']`)
    if(!this.selfElement) throw new Error(`Id on script tag not found: id="widget-${this.pkg.pkgName}"`)
  
    this.parentNode = this.selfElement.parentNode
    this.createMountDiv()
  }

  loadLink (href, { rel } = {}){
    const tag = document.createElement('link')
  
    tag.rel     = rel? rel : 'stylesheet'
    tag.href    = href
  
    const promiseFn = (resolve, reject) => {
      this.insertElement(tag)
      tag.onload  = () => resolve(tag)
      tag.onerror = () => reject(false)
    }
  
    return new Promise(promiseFn)
  }
  
  loadScript (src, { async, defer, nomodule, type, id }) {
    const tag = document.createElement('script')
  
    if(async)    tag.async    = true
    if(defer)    tag.defer    = true
    if(nomodule) tag.nomodule = true
    if(type)     tag.type     = type
    if(id)       tag.id       = id

    tag.src = src

    const promiseFn = (resolve, reject) => {
      this.insertElement(tag)
      tag.onload  = () => resolve(tag)
      tag.onerror = () => reject(false)
    }
  
    return new Promise(promiseFn)
  }

  loadCss(){
    const { css } = this
  
    if(!css || !css.length) return

    const loadLinkPromises =[]

    for (const cssUrl of css)
      loadLinkPromises.push(this.loadLink(cssUrl))

    return Promise.all(loadLinkPromises)
  }

  loadEsShim(){
    const id                  = 'es-shim-script'
    const esShimScriptElement = document.getElementById(id)

    if(esShimScriptElement) return esShimScriptElement

    return this.loadScript(this.esShimCdnUrl, { async: true, id  })
  }

  loadImportMap(){
    const id               = `import-map-${this.pkg.pkgName}`
    const importMapElement = document.getElementById(id)

    if(importMapElement) return importMapElement

    return this.loadScript(this.importMapUrl, { defer: true, id, type: 'importmap-shim' })
  }

  loadWidgetMount(){
    const identifier = this.getIdentifierSearchParam()? '-'+this.getIdentifierSearchParam() : ''

    return this.loadScript(this.widgetMountUrl+ `?mount-${this.pkg.pkgName}${identifier}`, { type: 'module-shim' })
  }

  attrsAsOptions(){
    if (!this.selfElement.hasAttributes()) return undefined

    const attrs = this.selfElement.attributes
    const props = { options: {} }

    for (const { name, value } of attrs){
      if([ 'id', 'src', 'type' ].includes(name)) continue

      if(name === 'options' && isJson(value))
        for (const [ optName, optValue ] of Object.entries(toJson(value)))
          if(optValue) props.options[optName] = optValue

      if(name !== 'options') props[camelCase(name)] = value
    }

    this.addRootPropsGlobal(props)

    return props
  }

  addRootPropsGlobal(rootProps = {}){
    if(!Object.keys(rootProps).length) return

    if(!window.chm) window.chm = {}

    window.chm[this.pkg.pascalPkgName] = { rootProps }
  }

  getIdentifierSearchParam(){

    if(!this.callingImportMetaUrl) return ''
    
    const { search } = new URL(this.callingImportMetaUrl)
  
    return search.replace('?', '')
  }
}

const isString = (input) => typeof input === 'string' && Object.prototype.toString.call(input) === '[object String]' 

function toJson(aProp){
  try{
    const isJsonProp = isJson(aProp)

    return isJsonProp? isJsonProp: aProp
  }
  catch(err){

    return aProp
  }
}

function isJson(aProp){
  try{
    if(isString(aProp) && (aProp.includes('{') || aProp.includes('|')))
      return JSON5.parse(aProp)
  }
  catch(err){
    return false
  }
}

