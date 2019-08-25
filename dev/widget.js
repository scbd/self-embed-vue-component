import EmbedComp from '../src/index'

//const VERSION       = process.env.VUE_APP_VERSION
const URL           = 'https://s3.amazonaws.com/scbd-components/production'
const COMP_CSS_URL  = `${URL}/action-agenda/action-list/actionList.css`
const COMP_JS_URL   = `${URL}/action-agenda/action-list/actionList.umd.min.js`


const options = {
  compName          : 'actionList', //required
  scriptDependancies: [COMP_JS_URL], // required comp to load
  cssDependancies   : [COMP_CSS_URL]
}

EmbedComp.setOptions(options)