import { Form } from 'lib/types';
import { useState } from 'react';
import CaptchaSettingsInner from './Inner';
import { RadioGroup } from '@headlessui/react';
import { classNames } from 'lib/client/utils';

type CaptchaSettingsProps = {
  form: Form;
  mutate: (data?: any) => void;
};

const CAPTCHA_PROVIDERS = [
  {
    name: 'None',
    value: 'none',
  },
  {
    name: 'reCAPTCHA',
    value: 'recaptcha',
    shortdesc: 'Google reCAPTCHA v2',
  },
  {
    name: 'hCaptcha',
    value: 'hcaptcha',
    shortdesc: 'hCaptcha, the privacy-first alternative to reCAPTCHA',
  },
  {
    name: 'Turnstile',
    value: 'turnstile',
    shortdesc: "CloudFlare's take on CAPTCHA",
  },
];

const CaptchaSettings = ({ form, mutate }: CaptchaSettingsProps) => {
  const [type, setType] = useState(form.settings?.captcha?.type || 'none');

  return (
    <div className="p-4 mt-8 bg-white rounded-lg shadow md:mt-12 md:p-6">
      <h3 className="font-bold">Captcha</h3>
      <div>
        <RadioGroup value={type} onChange={setType}>
          <RadioGroup.Label className="sr-only">Captcha type</RadioGroup.Label>

          <div className="w-full space-x-4 flex mt-4">
            {CAPTCHA_PROVIDERS.map((provider) => (
              <RadioGroup.Option key={provider.value} value={provider.value} className="w-full">
                {({ checked }) => (
                  <div
                    className={classNames(
                      'p-4 border rounded h-full cursor-pointer',
                      checked && 'bg-emerald-100 border-emerald-500'
                    )}
                  >
                    <h3 className="font-bold">{provider.name}</h3>
                    <span className="text-xs text-gray-500">{provider.shortdesc}</span>
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>

        <div className="mt-4">
          <CaptchaSettingsInner type={type} form={form} mutate={mutate}></CaptchaSettingsInner>
        </div>
      </div>
    </div>
  );
};

export default CaptchaSettings;
