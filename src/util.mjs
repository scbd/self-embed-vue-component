import { paramCase  } from 'param-case'
import { pascalCase } from 'pascal-case'

const cdnUrl = 'https://cdn.cbd.int'

const testWidgetMap = {
    cssDefaultUrl  : 'http://localhost:5000/style.css'                     ,
    importMapUrl   : 'http://localhost:5000/preview/widget/import-map.json',
    widgetMountUrl : 'http://localhost:5000/preview/widget/mount.js'       ,
    widgetUrl      : 'http://localhost:5000/preview/widget/index.js'
}

export const setPkg = (rawPackage, { buildTestWidget, buildTestWidgetMount } ) => {
  const pkg = {}

  pkg.scopeLessName        = rawPackage.name.replace(new RegExp('@|/', 'i'), '')
  pkg.pascalPkgName        = pascalCase(pkg.scopeLessName)
  pkg.pkgName              = paramCase(pkg.scopeLessName)
  pkg.buildTestWidget      = buildTestWidget
  pkg.buildTestWidgetMount = buildTestWidgetMount

  for (const key in rawPackage)
    pkg[key] = rawPackage[key]

  return pkg
}

export function getEsShimsUrl(pkg){

  const { dependencies } = pkg
  const   version        = dependencies['es-module-shims'] || '1.4.4'

  return `https://cdn.jsdelivr.net/npm/es-module-shims@${version}/dist/es-module-shims.js`
}


export const getCssUrl = (pkg) => {
  const { name, buildTestWidget } = pkg

  if(buildTestWidget) return testWidgetMap['cssDefaultUrl']

  return `${cdnUrl}/${name}/dist/style.css`
}

export const getWidgetMountUrl = (pkg) => {
  const { name, buildTestWidget } = pkg

  if(buildTestWidget) return testWidgetMap['widgetMountUrl']

  return `${cdnUrl}/${name}/dist/widget/mount.js`
}

export const getWidgetElementId = (pkg) => {
  const { pkgName } = pkg

  return `widget-${pkgName}`
}

export const getImportMapUrl = (pkg) => {
  const { name, buildTestWidget } = pkg

  if(buildTestWidget) return testWidgetMap['importMapUrl']

  return `${cdnUrl}/${name}/dist/import-map.json`
}

