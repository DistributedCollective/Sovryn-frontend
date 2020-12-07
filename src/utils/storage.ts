// Package for properly handling errors and exceptions from storage
import { storageFactory } from 'storage-factory';

export const local = storageFactory(() => localStorage);
export const session = storageFactory(() => sessionStorage);
