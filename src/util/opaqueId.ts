import { UserInputError } from 'apollo-server-express';

export interface TransparentID {
  dbId: any;
}

export interface ExtendedTransparentID {
  transparentID: TransparentID;
  param: string;
}

export const OpaqueID = {
  encode(type: Function | string, dbId: number): string {
    return this.encodeExtended(type, 'id', dbId);
  },

  encodeExtended(type: Function | string, param: string, dbId: any): string {
    const typeName = typeof type === 'string' ? type : type.name;
    return Buffer.from(`${typeName}:${param}:${dbId}`).toString('base64');
  },

  decode(type: Function | string, opaqueId: string): TransparentID {
    const decoded = this.decodeExtended(type, opaqueId).transparentID;
    if (!isFinite(decoded.dbId)) {
      throw new UserInputError('Invalid ID provided');
    }

    return decoded;
  },

  decodeExtended(type: Function | string, opaqueId: string): ExtendedTransparentID {
    const [inputName, param, inputId] = Buffer.from(opaqueId, 'base64').toString().split(':');
    const typeName = typeof type === 'string' ? type : type.name;
    if (inputId === '' || typeName !== inputName) {
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
