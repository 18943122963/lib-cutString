import { cutString } from '../src/cutString'

// 模式1，不同字符不同字节数
test('裁剪单词测试', () => {
  //正常测试，溢出与非溢出
  expect(cutString('01234567890')).toBe('0123456789...')
  expect(cutString('0123456789')).toBe('0123456789')
  //带汉字测试，正常汉字为2字节
  expect(cutString('012345678九')).toBe('012345678...')
  expect(cutString('01234567八')).toBe('01234567八')
  //带emoji的测试，😊四字节
  expect(cutString('😊')).toBe('😊')
  expect(cutString('123456😊')).toBe('123456😊')
  expect(cutString('1234567😊')).toBe('1234567...')
  //一家人测试，一个emoji占了22字节
  expect(
    cutString('12345678👨‍👩‍👧‍👧', {
      cut_len: 30,
    })
  ).toBe('12345678👨‍👩‍👧‍👧')
  expect(
    cutString('12345678👨‍👩‍👧‍👧', {
      cut_len: 9,
    })
  ).toBe('12345678...')

  //测试config参数
  expect(
    cutString('0123456789', {
      cut_len: 5,
    })
  ).toBe('01234...')
  expect(
    cutString('01234567890', {
      fill_flag: '*',
    })
  ).toBe('0123456789***')
  expect(
    cutString('01234567890', {
      fill_len: 6,
    })
  ).toBe('0123456789......')
  expect(
    cutString('   01234567890', {
      do_trim: false,
    })
  ).toBe('   0123456...')
  expect(
    cutString('123456789😊😊', {
      cut_len: 13,
      fill_flag: '😭',
      fill_len: 6,
    })
  ).toBe('123456789😊😭😭😭😭😭😭')
  //传入空值情况
  expect(cutString('')).toBe('')
  expect(cutString(null)).toBe('')
  expect(cutString(undefined)).toBe('')
  expect(cutString(' ')).toBe('')
  expect(cutString(false)).toBe('false')
  //传入负值情况
  expect(
    cutString('0123456789', {
      cut_len: -5,
    })
  ).toBe('')
})

//模式2，所有字符均视为1字节
test('裁剪单词测试，mode2', () => {
  //正常测试，溢出与非溢出
  expect(cutString('01234567890', { mode: 2 })).toBe('0123456789...')
  expect(cutString('0123456789', { mode: 2 })).toBe('0123456789')
  //带汉字测试，正常汉字为2字节
  expect(cutString('012345678九', { mode: 2 })).toBe('012345678九')
  //带emoji的测试，😊四字节
  expect(cutString('😊')).toBe('😊')
  expect(cutString('1234567😊', { mode: 2 })).toBe('1234567😊')
  //一家人测试，一个emoji占了22字节
  expect(
    cutString('12345678👨‍👩‍👧‍👧', {
      cut_len: 9,
      mode: 2,
    })
  ).toBe('12345678👨‍👩‍👧‍👧')

  //测试config参数
  expect(
    cutString('0123456789', {
      cut_len: 5,
      mode: 2,
    })
  ).toBe('01234...')
  expect(
    cutString('01234567890', {
      fill_flag: '*',
      mode: 2,
    })
  ).toBe('0123456789***')
  expect(
    cutString('01234567890', {
      fill_len: 6,
      mode: 2,
    })
  ).toBe('0123456789......')
  expect(
    cutString('   01234567890', {
      do_trim: false,
      mode: 2,
    })
  ).toBe('   0123456...')
  expect(
    cutString('123456789😊😊', {
      cut_len: 10,
      fill_flag: '😭',
      fill_len: 6,
      mode: 2,
    })
  ).toBe('123456789😊😭😭😭😭😭😭')
  //传入空值情况
  expect(cutString('', { mode: 2 })).toBe('')
  expect(cutString(null, { mode: 2 })).toBe('')
  expect(cutString(undefined, { mode: 2 })).toBe('')
  expect(cutString(' ', { mode: 2 })).toBe('')
  expect(cutString(false, { mode: 2 })).toBe('false')
  //传入负值情况
  expect(
    cutString('0123456789', {
      cut_len: -5,
      mode: 2,
    })
  ).toBe('')
})
