/* eslint-disable no-console */

import mobx from 'mobx'
import { AppRegistry } from 'react-native-macos'
import App from './src/App'

AppRegistry.registerComponent('PlexMusic', () => App)

const style = 'color: #006d92; font-weight:bold;'
const repeat = (str, times) => (new Array(times + 1)).join(str)
const pad = (num, maxLength) => repeat('0', maxLength - num.toString().length) + num
const formatTime = time => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`

if (__DEV__) {
  console.ignoredYellowBox = ['Warning: In next release empty section headers will be rendered']

  mobx.spy((event) => {
    if (event.type === 'action') {
      console.groupCollapsed(`Action @ ${formatTime(new Date())} ${event.name}`)
      console.log('%cType: ', style, event.type)
      console.log('%cName: ', style, event.name)
      console.log('%cTarget: ', style, event.target)
      console.log('%cArguments: ', style, event.arguments)
      console.groupEnd()
    }
  })
}
