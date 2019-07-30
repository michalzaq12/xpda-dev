import { stubObject } from 'ts-sinon'
import { IStep, Timer } from '../../../src'
import { logger } from './logger'

export const step = stubObject<IStep>(new Timer(logger))
