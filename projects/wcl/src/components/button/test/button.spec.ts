import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { ButtonComponent } from '../button';

describe('button', () => {
  const renderPage = async (html: string, supportsShadowDom = false): Promise<SpecPage> => {
    return await newSpecPage({
      html,
      components: [ButtonComponent],
      supportsShadowDom,
    });
  };

  it('should have shadow dom enabled', async () => {
    const page = await renderPage('<wx-button></wx-button', true);
    expect(page.root.shadowRoot).toBeTruthy();
  });

  it('should have default classes', async () => {
    const page = await renderPage('<wx-button></wx-button');
    expect(page.root.classList.contains('wx-activatable'));
    expect(page.root.classList.contains('wx-focusable'));
  });

  describe('props', () => {
    it('should be disabled', async () => {
      const page = await renderPage('<wx-button disabled="true"></wx-button');
      const x = page.root;
      expect(page.root).toMatchSnapshot();
    });
  });
});
