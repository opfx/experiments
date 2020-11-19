import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { isRegExp } from 'util';

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
    it(`should not be disabled by default`, async () => {
      const page = await renderPage('<wx-button></wx-button');
      expect(page.root.hasAttribute('disabled')).toEqual(false);
      expect(page.root.hasAttribute('aria-disabled')).toEqual(false);
    });

    it('should be disabled when "disabled" is set to true', async () => {
      const page = await renderPage('<wx-button disabled="true"></wx-button');
      expect(page.root.hasAttribute('disabled')).toBeTruthy();
      expect(page.root.hasAttribute('aria-disabled')).toBeTruthy();
    });

    describe('size', () => {
      it('should have default size class when "size" attr is not given', async () => {
        const page = await renderPage('<wx-button></wx-button');
        expect(page.root.classList.contains('button-default')).toBeTruthy();
      });

      it('should have specified size class when "size" attr is given', async () => {
        const page = await renderPage(`<wx-button size='small'></wx-button`);
        expect(page.root.classList.contains('button-small')).toBeTruthy();
      });

      it('should have specified size class when "size" attr is given and buttonType is specified', async () => {
        const page = await renderPage(`<wx-button buttonType='some-type' size='small'></wx-button`);
        expect(page.root.classList.contains('some-type-small')).toBeTruthy();
      });
    });
  });
});
