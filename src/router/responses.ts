import { Request, Response } from 'express'

export const sendOk200Response = (req: Request, res: Response, data: any) => {
  res.status(200).json({
    status: 'OK',
    data,
  })
}

export const sendNotOk200Response = (req: Request, res: Response, data: any) => {
  res.status(200).json({
    status: 'NOT_OK',
    data,
  })
}

export const sendNotOk503Response = (req: Request, res: Response, data: any) => {
  res.status(503).json({
    status: 'NOT_OK',
    data,
  })
}

export const sendNotOk401Response = (req: Request, res: Response, data: any) => {
  res.status(401).json({
    status: 'NOT_OK',
    data,
  })
}

export const sendNotOk404Response = (req: Request, res: Response, data: any) => {
  res.status(404).json({
    status: 'NOT_OK',
    data,
  })
}
