import {
  Length,
  IsEmail,
  validate,
  ValidationError,
  IsMobilePhone,
} from 'class-validator';
import { EMAIL_FIELDS, EmailFieldType } from '../constants';
import { sendEmail } from '../external-api/courier';

export interface FeedbackFormType {
  fullName: string;
  text: string;
  email: string;
  subject: string;
}

export interface SupplyFormType {
  name: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  pointCode: string;
  pointAddress: string;
  objType: string;
  askoe: string;
  payment: string;
  power: string;
  consume: string;
  subject: string;
}

export interface ConnectFormType extends FeedbackFormType {
  subject: string;
  phone: string;
  address: string;
  objType: string;
  power: string;
}

type FormTypes = FeedbackForm | SupplyForm | ConnectForm;

enum FORM_TITLE {
  SUPPLY = 'supply',
  FEEDBACK = 'feedback',
  CONNECT = 'connect',
}

const FEEDBACK_SUBJECT = "Зворотній зв'язок";

const createEmailText = (emailObject: FormTypes) => {
  return Object.entries(emailObject)
    .map(
      array =>
        `**${EMAIL_FIELDS[array[0] as keyof EmailFieldType]}**: ${array[1]}`
    )
    .join('\n');
};

class SubmitType {
  subject: string;

  async validate(formFields: FormTypes) {
    const errors: ValidationError[] = await validate(formFields, {
      validationError: { target: false },
    }); // errors is an array of validation errors
    if (errors.length > 0) {
      const invalidParams = errors.map(error => error.property);
      return { success: false, errors: invalidParams };
    }
    return { success: true, errors: [] };
  }

  async submit(formFields: FormTypes) {
    const text = createEmailText(formFields);
    const messageSentRes = await sendEmail(text, formFields.subject);
    if (messageSentRes.status) {
      return { success: true, errors: [] };
    }
    return {
      success: false,
      errors: [messageSentRes.error],
    };
  }
}

export class FeedbackForm extends SubmitType {
  @Length(3, 80)
  fullName: string;
  @Length(10, 2000)
  text: string;
  @IsEmail()
  email: string;
  @Length(5, 100)
  subject: string;

  constructor(fields: FeedbackFormType) {
    super();
    this.fullName = fields.fullName;
    this.text = fields.text;
    this.email = fields.email;
    this.subject = FEEDBACK_SUBJECT;
  }
}

export class SupplyForm extends SubmitType {
  @Length(3, 80)
  name: string;
  @Length(3, 80)
  contactName: string;
  @IsEmail()
  email: string;
  @Length(5, 15)
  phoneNumber: string;
  @Length(1, 80)
  pointCode: string;
  @Length(3, 80)
  pointAddress: string;
  @Length(3, 80)
  objType: string;
  @Length(3, 80)
  askoe: string;
  @Length(3, 80)
  payment: string;
  @Length(3, 80)
  power: string;
  @Length(3, 80)
  consume: string;
  @Length(1, 80)
  subject: string;

  constructor(fields: SupplyFormType) {
    super();
    this.name = fields.name;
    this.contactName = fields.contactName;
    this.email = fields.email;
    this.phoneNumber = fields.phoneNumber;
    this.pointCode = fields.pointCode;
    this.pointAddress = fields.pointAddress;
    this.objType = fields.objType;
    this.askoe = fields.askoe;
    this.payment = fields.payment;
    this.power = fields.power;
    this.consume = fields.consume;
    this.subject = fields.subject;
  }
}

export class ConnectForm extends SubmitType {
  @Length(3, 80)
  fullName: string;
  @IsEmail()
  email: string;
  @Length(3, 80)
  subject: string;
  @Length(5, 15)
  phone: string;
  @Length(3, 80)
  address: string;
  @Length(3, 80)
  objType: string;
  @Length(3, 80)
  power: string;

  constructor(fields: ConnectFormType) {
    super();
    this.fullName = fields.fullName;
    this.email = fields.email;
    this.subject = fields.subject;
    this.phone = fields.phone;
    this.address = fields.address;
    this.objType = fields.objType;
    this.power = fields.power;
  }
}

export const getFormByType = (type: string) => {
  if (type === FORM_TITLE.FEEDBACK) {
    return FeedbackForm;
  }
  if (type === FORM_TITLE.SUPPLY) {
    return SupplyForm;
  }
  if (type === FORM_TITLE.CONNECT) {
    return ConnectForm;
  }
};
