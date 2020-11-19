import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { isRegExp } from 'util';

import { Button } from './../button';

describe('button', () => {
  const renderPage = async (html: string, supportsShadowDom = false): Promise<SpecPage> => {
    return await newSpecPage({
      html,
      components: [Button],
      supportsShadowDom,
    });
  };

  it('should have shadow dom enabled', async () => {
    const { root } = await renderPage('<wx-button></wx-button>', true);
    expect(root.shadowRoot).toBeTruthy();
  });

  it('should have default classes', async () => {
    const page = await renderPage('<wx-button></wx-button');
    expect(page.root.classList.contains('wx-activatable')).toBeTruthy();
    expect(page.root.classList.contains('wx-focusable')).toBeTruthy();
  });

  it('should have the "button" class by default', async () => {
    const { root } = await renderPage('<wx-button></wx-button>');
    expect(root.classList.contains('button')).toBeTruthy();
  });

  it('should render with a button by default', async () => {
    const { root } = await renderPage('<wx-button></wx-button>');
    const firstElementChild = root.firstElementChild;
    expect(firstElementChild.nodeName).toBe(`BUTTON`);
  });

  it('should render with an anchor when href is specified', async () => {
    const { root } = await renderPage('<wx-button href="https://google.com"></wx-button>');
    expect(root.firstElementChild.nodeName).toBe('A');
  });

  it('should have the "button-has-icon-only" class when an icon request the "icon-only" slot', async () => {
    const { root } = await renderPage('<wx-button><wx-icon slot="icon-only"/></wx-button>');
    expect(root.classList.contains('button-has-icon-only')).toBeTruthy();
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

    it('should have "button-disabled" class when "disabled" is set to true', async () => {
      const page = await renderPage('<wx-button disabled="true"></wx-button');
      expect(page.root.classList.contains('button-disabled')).toBeTruthy();
    });

    describe('expand', () => {
      it('should have "button-block" class when the "expand" is set to "block"', async () => {
        const { root } = await renderPage('<wx-button expand="block"></wx-button>');
        expect(root.classList.contains('button-block')).toBeTruthy();
      });

      it('should have "button-full" class when the "expand" is set to "full"', async () => {
        const { root } = await renderPage('<wx-button expand="full"></wx-button>');
        expect(root.classList.contains('button-full')).toBeTruthy();
      });
    });

    describe('fill', () => {
      it('should have "button-solid" class by default', async () => {
        const { root } = await renderPage('<wx-button></wx-button>');
        expect(root.classList.contains('button-solid')).toBeTruthy();
      });

      it('should have "button-clear" class when the "fill" is set to "clear"', async () => {
        const { root } = await renderPage('<wx-button fill="clear"></wx-button>');
        expect(root.classList.contains('button-clear')).toBeTruthy();
      });

      it('should have "button-outline" class when the "fill" is set to "outline"', async () => {
        const { root } = await renderPage('<wx-button fill="outline"></wx-button>');
        expect(root.classList.contains('button-outline')).toBeTruthy();
      });
    });

    describe('shape', () => {
      it('should have "button-round" class when the "shape" is set to "round"', async () => {
        const { root } = await renderPage('<wx-button shape="round"></wx-button>');
        expect(root.classList.contains('button-round')).toBeTruthy();
      });
    });
  });

  describe('events', () => {
    // it('should emit "wxFocus" event when receives focus', async () => {
    //   const _cb = jest.fn();
    //   const page = await renderPage('<wx-button></wx-button>');
    //   page.doc.addEventListener('wxFocus', _cb);
    //   await page.waitForChanges();
    //   const p = page.root.querySelector('button');
    //   p.focus();
    //   expect(_cb).toHaveBeenCalled();
    // });
  });
});
