/**
 * 传入config对象进行裁剪
 * str为目标，config对象为配置
 * config{
 *   mode 模式，模式1下字符按原本字节数计算（汉字视为2字节,emoji更多）；模式2下所有字符均按1字节计算，默认mode为1
 *   cut_len 保留长度，默认10
 *   fill_flag  超出时的填充物符号，默认为.
 *   fill_len 填充物长度，默认为3
 *   do_trim 裁剪前后空格操作，true开/false关，默认true
 * }
 */
//lodash里处理emoji的一段代码，将字符串中的每一个字符都拆成数组之一（模式2）
import { toArray } from './toArray'
interface ConfigTemp {
  cut_len?: number
  fill_flag?: string
  fill_len?: number
  do_trim?: boolean
  mode?: number
}
interface Config {
  cut_len: number
  fill_flag: string
  fill_len: number
  do_trim: boolean
  mode?: number
}
export const cutString = (str: any, configTemp: ConfigTemp = {}) => {
  //初始化默认参数,使用&&代替了if，参数为空时使用默认值
  //ts无法识别为非空，要加个configTemp过渡对象，让ts知道所有属性确实存在
  isNot(configTemp.cut_len) && (configTemp.cut_len = 10)
  isNot(configTemp.fill_flag) && (configTemp.fill_flag = '.')
  isNot(configTemp.fill_len) && (configTemp.fill_len = 3)
  isNot(configTemp.do_trim) && (configTemp.do_trim = true)
  isNot(configTemp.mode) && (configTemp.mode = 1)
  //使用！解决ts校验问题
  let config: Config = {
    cut_len: configTemp.cut_len!,
    fill_flag: configTemp.fill_flag!,
    fill_len: configTemp.fill_len!,
    do_trim: configTemp.do_trim!,
    mode: configTemp.mode!,
  }

  //预处理
  str = doAdjust(str, config)
  //裁剪填充
  str = doCut(str, config)
  return str
}

//判断是否为null，undefined
const isNot = (parm): boolean => parm === null || parm === undefined
//求字符串长度
const getStrLen = (str: string, config: Config): number => {
  //模式1，将每个字视为2字节，特殊字符可能视为更多字节
  if (config.mode === 1) {
    return str.replace(/[^\x00-\xff]/g, '01').length
  } else if (config.mode === 2) {
    //模式2，无论什么字符均视为1字节
    return toArray(str).length
  } else {
    printErr(4)
    return -1
  }
}

//对接受的字符串进行预处理
const doAdjust = (str: any, config: Config): string => {
  //检测空值
  let errArr: any[] = [null, undefined, '']
  if (errArr.includes(str)) {
    printErr(1)
    return ''
  }
  if (config.cut_len < 0) {
    printErr(2)
    return ''
  }
  if (config.fill_len < 0) {
    printErr(3)
    return ''
  }
  //转换为字符串
  if (typeof str !== 'string') {
    str = String(str)
  }
  return str
}
//裁剪
const doCut = (str: string, config: Config): string => {
  if (str === '') return ''
  //删除空格操作
  config.do_trim && (str = str.trim())

  //获得字符串实际长度
  let str_len: number = getStrLen(str, config)

  //若实际长度小于标准，则直接返回
  if (str_len <= config.cut_len) return str
  //若实际长度大于标准，则需要裁剪并填充
  else {
    let temp: string = ''
    let temp_len: number = 0
    //考虑到emoji的存在，需要先进行Array.from
    for (let item of toArray(str)) {
      //若该字的长度加上当前总长度大于最大长度，结束循环（实际上只有模式1需要，模式2都视为一个字）
      if (getStrLen(item, config) + temp_len > config.cut_len) break
      //若长度正常满足，结束循环
      if (temp_len >= config.cut_len) break
      //若长度不满足，继续增长
      else {
        temp += item
        temp_len += getStrLen(item, config)
      }
    }
    //填充
    return (temp += config.fill_flag.repeat(config.fill_len))
  }
}

//error函数
const printErr = (num: number) => {
  switch (num) {
    case 1: {
      console.log('裁剪的字符串为空/undefined/null')
      break
    }
    case 2: {
      console.log('裁剪的长度不能为负数')
      break
    }
    case 3: {
      console.log('填充的长度不能为负数')
      break
    }
    case 4: {
      console.log('mode设定只能为1或者2')
      break
    }
  }
}
