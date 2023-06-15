import { Form } from 'lib/types';
import TurnstileSettings from 'components/Form/Settings/Captcha/Turnstile';
import NoCaptchaSettings from 'components/Form/Settings/Captcha/NoCaptcha';

type CaptchaSettingsInnerProps = {
  type: string;
  form: Form;
  mutate: (data?: any) => void;
};

const CaptchaSettingsInner = ({ type, form, mutate }: CaptchaSettingsInnerProps) => {
  switch (type) {
    case 'recaptcha':
      return <div></div>;
    case 'hcaptcha':
      return <div></div>;
    case 'turnstile':
      return <TurnstileSettings form={form} mutate={mutate}></TurnstileSettings>;
    default:
      return <NoCaptchaSettings form={form} mutate={mutate}></NoCaptchaSettings>;
  }
};

export default CaptchaSettingsInner;
