'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z, ZodError } from 'zod';


// TypeScript에서 사용할 수 있는 State 타입 정의
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/octet-stream",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export type State = {
    errors?: {
      title?: string[];
      content?: string[];
      options?: any;
      images?: any;
    };
    message?: string | null;
  };
  
// 폼 데이터에 대한 스키마 정의
const FormSchema = z.object({
    title: z.string().min(1, {
      message: "값을 입력해 주세요"
    }).max(20, {
      message: "최대 20자"
    }), // 값을 입력해 주세요, 최대 100자 이하
    content: z.string().min(1, {
      message: "값을 입력해 주세요"
    }).max(600, {
      message: "최대 600자"
    }),
    options: z.array(z.string(
    ).min(1, {
      message: "값을 입력해 주세요"
    }).max(20, {
      message: "최대 20자"
    })),
    images: z.array(
      z.object({
        size: z.number(),
        type: z.string(),
      })
    ).refine((files) => {
      if (!files || files.length === 0) {
        // 파일이 없을 경우 유효성 검사를 통과하도록 설정
        console.log('hihi')
        return true;
      }
    
      // 파일이 있는 경우 유효성 검사 실행
      const isValidSize = files.every((file) => file?.size <= MAX_FILE_SIZE);
      const isValidType = files.every((file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type));
    
      return isValidSize && isValidType;
    }, {
      message: "이미지의 형식 혹은 이미지 크기 5MB 초과입니다.",
    })
  });

const OptionFormSchema = z.object({
  option: z.string(
  ).min(1, {
    message: "값을 입력해 주세요"
  }).max(20, {
    message: "최대 20자"
  })
});

const CreatePost = FormSchema.omit({});
const CreateOption = OptionFormSchema.omit({});

export async function createPost(prevState: State, formData: FormData) {
  const validatedFields = CreatePost.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    options: formData.getAll('options'),
    images: formData.getAll('images'),
  });
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors
    console.log(formData.getAll('images'), 'sksk')
    if(errors.options){
      // const optionMessages = []
      const options = formData.getAll('options');
      const optionMessages: any = Array.from({ length: options.length }).map((item, idx) => {
        const validateOptionField = CreateOption.safeParse({
          option: options[idx],
        });
        return validateOptionField.success ? [''] : validateOptionField.error.flatten().fieldErrors.option;
      });
      errors.options = optionMessages;
    }
    return {
      errors: errors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  return {
    errors: {},
    message: 'success',
  };
}