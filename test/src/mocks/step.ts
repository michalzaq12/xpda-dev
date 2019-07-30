import { stubObject } from 'ts-sinon'
import { IStep, Timer } from '../../../src'
import { loggerStub } from './logger'

export const stepStub = stubObject<IStep>(new Timer(loggerStub))
