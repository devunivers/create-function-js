'use babel';

import CreateFunctionJsView from './create-function-js-view';
import { CompositeDisposable } from 'atom';

export default {

  createFunctionJsView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.createFunctionJsView = new CreateFunctionJsView(state.createFunctionJsViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.createFunctionJsView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'create-function-js:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.createFunctionJsView.destroy();
  },

  serialize() {
    return {
      createFunctionJsViewState: this.createFunctionJsView.serialize()
    };
  },

  toggle() {
      let editor
      if (editor = atom.workspace.getActiveTextEditor()) {
      let cursor2 =editor.getCursorBufferPositions()[0];
      let oldPosition = editor.getCursorScreenPosition();
      cursor2.column = 0;

      editor.selectToBufferPosition(cursor2);
      let lineSel = editor.getSelectedText();

        editor.insertText(String(lineSel).replace('>',''))
        editor.setCursorScreenPosition(oldPosition);
        editor.selectToPreviousWordBoundary();
        let selection = editor.getSelectedText()
        let isA = String(lineSel).search(new RegExp('>'+selection,"g")) !== -1;
        if(selection !== ''){
            if(isA){
                editor.insertText(`let ${selection} = ()=>{\n\n}`);
            }else{
                editor.insertText(`function ${selection}(){\n\n}`);
            }
            editor.moveUp(1);
        }
    }
  }

};
