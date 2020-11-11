import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { BackdropComponent } from './../backdrop';

describe('button', () => {
  const renderPage = async (html: string, supportsShadowDom = false): Promise<SpecPage> => {
    return await newSpecPage({
      html,
      components: [BackdropComponent],
      supportsShadowDom,
    });
  };

  it('should have shadow dom enabled', async () => {
    const page = await renderPage('<wx-backdrop></wx-backdrop', true);
    expect(page.root.shadowRoot).toBeTruthy();
  });

  it('should emit on click', async () => {
    const _cb = jest.fn();
    const page = await renderPage('<wx-backdrop></wx-backdrop', true);
    page.doc.addEventListener('wxBackdropTap', _cb);
    await page.waitForChanges();

    page.root.click();
    expect(_cb).toHaveBeenCalled();
  });

  describe('props', () => {
    it('should not have the "backdrop-hide" class when the "visible" attribute is not specified', async () => {
      const { root } = await renderPage('<wx-backdrop ></wx-backdrop');
      expect(root.classList.contains('backdrop-hide')).toBeFalsy();
    });

    it('should have the "backdrop-hide" class when the "visible" attribute is set to false', async () => {
      const { root } = await renderPage('<wx-backdrop visible="false"></wx-backdrop');
      expect(root.classList.contains('backdrop-hide')).toBeTruthy();
    });

    it('should not have the "backdrop-not-tappable" class when the "tappable" attribute is not specified', async () => {
      const { root } = await renderPage('<wx-backdrop></wx-backdrop');
      expect(root.classList.contains('backdrop-not-tappable')).toBeFalsy();
    });

    it('should have the "backdrop-not-tappable" class when the "tappable" attribute is set to false', async () => {
      const { root } = await renderPage('<wx-backdrop tappable="false"></wx-backdrop');
      expect(root.classList.contains('backdrop-not-tappable')).toBeTruthy();
    });
  });
});
