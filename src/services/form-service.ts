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

const createEmailText = (
  emailObject: FeedbackFormType | SupplyFormType | ConnectFormType
) => {
  return Object.entries(emailObject)
    .map(
      array =>
        `**${EMAIL_FIELDS[array[0] as keyof EmailFieldType]}**: ${array[1]}`
    )
    .join('\n');
};

class SubmitType {
  subject: string;

  async validate(
    formFields: FeedbackFormType | SupplyFormType | ConnectFormType
  ) {
    const errors: ValidationError[] = await validate(formFields, {
      validationError: { target: false },
    }); // errors is an array of validation errors
    if (errors.length > 0) {
      const invalidParams = errors.map(error => error.property);
      return { success: false, errors: invalidParams };
    }
    return { success: true, errors: [] };
  }

  async submit(
    formFields: FeedbackFormType | SupplyFormType | ConnectFormType
  ) {
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
  @Length(10, 1000)
  text: string;
  @IsEmail()
  email: string;
  subject: string;

  constructor(fields: FeedbackFormType) {
    super();
    this.fullName = fields.fullName;
    this.text = fields.text;
    this.email = fields.email;
    this.subject = "Зворотній зв'язок";
  }
}

export class SupplyForm extends SubmitType {
  @Length(3, 80)
  name: string;
  @Length(3, 80)
  contactName: string;
  @IsEmail()
  email: string;
  @IsMobilePhone()
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
  @Length(10, 1000)
  text: string;
  @IsEmail()
  email: string;
  @Length(3, 80)
  subject: string;
  @Length(3, 80)
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
    this.text = fields.text;
    this.email = fields.email;
    this.subject = fields.subject;
    this.phone = fields.phone;
    this.address = fields.address;
    this.objType = fields.objType;
    this.power = fields.power;
  }
}

export const getFormByType = (type: string) => {
  if (type === 'feedback') {
    return FeedbackForm;
  }
  if (type === 'supply') {
    return SupplyForm;
  }
  if (type === 'connect') {
    return ConnectForm;
  }
};
