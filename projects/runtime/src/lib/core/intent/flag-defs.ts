export class FlagDefs {
  /**
   * If set, this activity will become the start of a new task on this
   * history stack.  A task (from the activity that started it to the
   * next task activity) defines an atomic group of activities that the
   * user can move to.  Tasks can be moved to the foreground and background;
   * all of the activities inside of a particular task always remain in
   * the same order.  See
   * <a href="{@docRoot}guide/topics/fundamentals/tasks-and-back-stack.html">Tasks and Back
   * Stack</a> for more information about tasks.
   *
   * <p>This flag is generally used by activities that want
   * to present a "launcher" style behavior: they give the user a list of
   * separate things that can be done, which otherwise run completely
   * independently of the activity launching them.
   *
   * <p>When using this flag, if a task is already running for the activity
   * you are now starting, then a new activity will not be started; instead,
   * the current task will simply be brought to the front of the screen with
   * the state it was last in.  See {@link #FLAG_ACTIVITY_MULTIPLE_TASK} for a flag
   * to disable this behavior.
   *
   * <p>This flag can not be used when the caller is requesting a result from
   * the activity being launched.
   */
  readonly ACTIVITY_NEW_TASK = 0x10000000;
}
