"use strict";
// the module 'vscode' contains the VS Code extensibility API
// import the necessary extensibility types to use in your code below
import {
  window,
  commands,
  workspace,
  Disposable,
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument
} from "vscode";

export function activate(context: ExtensionContext) {
  let discourager = new Discourager();

  let disposable = commands.registerCommand("discourage.toggle", () => {
    discourager.updateDiscourageMessage();
  });

  workspace.onDidSaveTextDocument(e => {
    discourager.updateDiscourageMessage();
  });

  // add to a list of disposables which are disposed when this extension is deactivated.
  context.subscriptions.push(discourager);
  context.subscriptions.push(disposable);
}

export function deactivate() {}

class Discourager {
  private _statusBarItem: StatusBarItem;
  private _discouragements = [
    "That was pretty meh...",
    "Uh...are you ok?",
    "Not sure about what you just did there...",
    "Do you want me to be nice...or honest?",
    "Maybe you should take ther rest of the day off...",
    "I'm not going to say you made a mistake...but..."
  ];

  private _timer: any;
  private statusBarAutoDismiss(millisecBeforeDismiss: any) {
    if (!this._statusBarItem) {
      return;
    }

    clearTimeout(this._timer);
    let that = this;
    this._timer = setTimeout(function() {
      that._statusBarItem.hide();
    }, millisecBeforeDismiss);
  }

  private getRandomDiscouragement() {
    return this._discouragements[
      Math.floor(Math.random() * this._discouragements.length)
    ];
  }

  public updateDiscourageMessage() {
    // create as needed
    if (!this._statusBarItem) {
      this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    }

    // get the current text editor
    let editor = window.activeTextEditor;
    if (!editor) {
      this._statusBarItem.hide();
      return;
    }

    this._statusBarItem.text = this.getRandomDiscouragement();
    this._statusBarItem.show();
    this.statusBarAutoDismiss(3000);
  }

  dispose() {
    this._statusBarItem.dispose();
  }
}
