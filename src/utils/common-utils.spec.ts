import { CommonUtils } from "./common-utils";
import {it, expect} from 'vitest'

describe('commons', () => {
    it('remove alphabet works fine', () => {
        expect(CommonUtils.removeAlphabet('5a')).toEqual('5');
        expect(CommonUtils.removeAlphabet('5a.')).toEqual('5.');
        expect(CommonUtils.removeAlphabet('5a..')).toEqual('5.');
        expect(CommonUtils.removeAlphabet('5a...')).toEqual('5.');
        expect(CommonUtils.removeAlphabet('5a.a')).toEqual('5.');
        expect(CommonUtils.removeAlphabet('5a.5')).toEqual('5.5');
        expect(CommonUtils.removeAlphabet('5a.5.')).toEqual('5.5');
        expect(CommonUtils.removeAlphabet('5a.5aa.')).toEqual('5.5');
        expect(CommonUtils.removeAlphabet('5a.5aa..')).toEqual('5.5');
        expect(CommonUtils.removeAlphabet('5a.5aa...22')).toEqual('5.522');
        
        expect(CommonUtils.removeAlphabet('-1')).toEqual('-1');
        expect(CommonUtils.removeAlphabet('-5a')).toEqual('-5');
        expect(CommonUtils.removeAlphabet('-5a.')).toEqual('-5.');
        expect(CommonUtils.removeAlphabet('-5a..')).toEqual('-5.');
        expect(CommonUtils.removeAlphabet('-5a...')).toEqual('-5.');
        expect(CommonUtils.removeAlphabet('-5a.a')).toEqual('-5.');
        expect(CommonUtils.removeAlphabet('-5a.5')).toEqual('-5.5');
        expect(CommonUtils.removeAlphabet('-5a.5.')).toEqual('-5.5');
        expect(CommonUtils.removeAlphabet('-5a.5aa.')).toEqual('-5.5');
        expect(CommonUtils.removeAlphabet('-5a.5aa..')).toEqual('-5.5');
        expect(CommonUtils.removeAlphabet('-5a.5aa...22')).toEqual('-5.522');
    })
});