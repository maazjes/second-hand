import {
  FieldHelperProps,
  FieldInputProps, FieldMetaProps, isString, useField
} from 'formik';
import {
  Category, MessageBody, PaginationBase, TypedImage
} from '@shared/types';
import { Dimensions, PixelRatio } from 'react-native';
import { ImagePickerOptions, launchImageLibraryAsync, launchCameraAsync } from 'expo-image-picker';
import { UpdatePostBody, UpdateUserBody } from '../types';

type IndexSignature = string | number | symbol;

export const addQuery = (query: string, params: {
  [key:IndexSignature]:string | number; }): string => {
  Object.keys(params).forEach((key, i): void => {
    if (i === 0) {
      query += `?${key}=${params[key]}`;
    } else {
      query += `&${key}=${params[key]}`;
    }
  });
  return query;
};

export const formatImages = (images: { uri: string }[]): Blob[] => {
  const formattedImages = [] as Blob[];
  images.forEach((image): void => {
    const split = image.uri.split('.');
    const extension = split[split.length - 1];
    const formattedImage = {
      uri: image.uri,
      name: 'image',
      type: `image/${extension}`
    } as unknown as Blob;
    formattedImages.push(formattedImage);
  });
  return formattedImages;
};

type CreateFormDataParams = UpdatePostBody & UpdateUserBody & MessageBody;

export const createFormData = (params: CreateFormDataParams): FormData => {
  const keys = Object.keys(params) as Array<keyof CreateFormDataParams>;
  const formdata = new FormData();
  keys.forEach((key): void => {
    if (key === 'images' && params.images) {
      const formattedImages = formatImages(params.images);
      formattedImages.forEach((image): void => {
        formdata.append('images', image);
      });
    }
    if (key === 'image' && params.image) {
      const formattedImages = formatImages([params.image]);
      formdata.append('image', formattedImages[0]);
    }
    if (key === 'categories') {
      formdata.append('categories', JSON.stringify(params[key]));
    }
    const value = params[key];
    if (isString(value)) {
      formdata.append(key, value);
    }
  });
  return formdata;
};

export const concatPages = (oldPage: PaginationBase, newPage: PaginationBase):
PaginationBase => ({
  totalItems: newPage.totalItems,
  offset: newPage.offset,
  data: oldPage.data.concat(newPage.data)
});

export const dpw = (widthPercent: number): number => {
  const screenWidth = Dimensions.get('window').width;
  return PixelRatio.roundToNearestPixel(screenWidth * widthPercent);
};

export const dph = (heightPercent: number): number => {
  const screenHeight = Dimensions.get('window').height;
  return PixelRatio.roundToNearestPixel(screenHeight * heightPercent);
};

export const conditionalUseField = (r: boolean, name: string):
// eslint-disable-next-line @typescript-eslint/no-explicit-any
[FieldInputProps<any>, FieldMetaProps<any>, FieldHelperProps<any>] | [] => {
  if (r) {
    return useField(name);
  }
  return [];
};

export const deepEqual = (x: object, y: object): boolean => {
  const ok = Object.keys; const tx = typeof x; const
    ty = typeof y;
  return x && y && tx === 'object' && tx === ty ? (
    ok(x).length === ok(y).length
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      && ok(x).every((key): boolean => deepEqual(x[key], y[key]))
  ) : (x === y);
};
export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

interface PickImageParams extends ImagePickerOptions {
  from: 'gallery' | 'camera';
}
export const pickImage = async ({
  from, ...params
}: PickImageParams): Promise<TypedImage[] | null> => {
  const result = from === 'gallery'
    ? await launchImageLibraryAsync(params)
    : await launchCameraAsync(params);
  if (result.canceled) {
    return null;
  }
  const images = result.assets.map(({ width, height, uri }): TypedImage => ({
    width, height, uri, id: (width / height) * Math.random()
  }));
  return images;
};

export const formatDate = (date: Date): string => {
  const created = new Date(date);
  const current = new Date();
  current.setDate(current.getDate() - 2);
  return created > new Date(current.getDate() - 1)
    ? created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : created > new Date(current.getDate() - 2)
      ? 'Eilen'
      : created.toDateString();
};
