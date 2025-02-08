/**
 * Lapisla Prover API
 * Lapisla Prover is a theorem proving assistant system with a web-based development environment and registry. 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface SnapshotRegisterResponse { 
    result: SnapshotRegisterResponse.ResultEnum;
}
export namespace SnapshotRegisterResponse {
    export type ResultEnum = 'registered' | 'already_registered' | 'invalid';
    export const ResultEnum = {
        Registered: 'registered' as ResultEnum,
        AlreadyRegistered: 'already_registered' as ResultEnum,
        Invalid: 'invalid' as ResultEnum
    };
}


