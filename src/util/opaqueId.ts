import { UserInputError } from 'apollo-server-express';

export interface TransparentID {
  dbId: any;
}

export interface ExtendedTransparentID {
  transparentID: TransparentID;
  param: string;
}

export const OpaqueID = {
  encode(type: Function, dbId: number): string {
    return this.encodeExtended(type, 'id', dbId);
  },

  encodeExtended(type: Function, param: string, dbId: any): string {
    return Buffer.from(`${type.name}:${param}:${dbId}`).toString('base64');
  },

  decode(type: Function, opaqueId: string): TransparentID {
    const decoded = this.decodeExtended(type, opaqueId).transparentID;
    if (!isFinite(decoded.dbId)) {
      throw new UserInputError('Invalid ID provided');
    }

    return decoded;
  },

  decodeExtended(type: Function, opaqueId: string): ExtendedTransparentID {
    const [inputName, param, inputId] = Buffer.from(opaqueId, 'base64').toString().split(':');
    if (type.name !== inputName) {
      throw new UserInputError('Invalid ID provided');
    }

    return {
      transparentID: {
        dbId: inputId,
      },
      param,
    };
  }
  ,
};
