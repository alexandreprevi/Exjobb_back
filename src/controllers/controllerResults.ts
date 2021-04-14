export const successResult = (data: any) => {
  return Promise.resolve({
    success: true,
    data,
  })
}

export const failedResult = (data: any) => {
  return Promise.resolve({
    success: false,
    data,
  })
}
