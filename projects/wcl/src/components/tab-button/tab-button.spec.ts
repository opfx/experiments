import { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';

import { TabButton } from './tab-button';

describe('tab-button', () => {
  const renderPage = async (html: string, supportsShadowDom = false): Promise<SpecPage> => {
    return await newSpecPage({ html, components: [TabButton], supportsShadowDom });
  };

  describe('disabled', () => {});
});
