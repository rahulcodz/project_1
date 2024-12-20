/**
 * Enum representing different types of actions that affect user credibility.
 * These actions are related to user posts, comments, and reports, and are used to assess a user's credibility based on their interactions.
 */
export enum UserCredibility {
  /**
   * Credibility level granted when a user's post receives an upvote.
   * Value: 2
   */
  POST_UP_VOTED = 2,

  /**
   * Credibility level granted when a user's post receives a downvote.
   * Value: -1
   */
  POST_DOWN_VOTED = -1,

  /**
   * Credibility level granted when a user is awarded from an account (e.g., gaining points or reputation from account actions).
   * Value: 10 (custom)
   */
  AWARDED_FROM_ACC = 10,

  /**
   * Credibility level granted when a user's comment receives an upvote.
   * Value: 1
   */
  COMMENT_UP_VOTED = 1,

  /**
   * Credibility level granted when a user's comment receives a downvote.
   * Value: 0
   */
  COMMENT_DOWN_VOTED = 0,

  /**
   * Credibility level assigned when a user's post is reported as misleading.
   * Value: -5
   */
  POST_REPORTED_MISLEADING = -5,

  /**
   * Credibility level assigned when a user's comment is reported as misleading.
   * Value: -3
   */
  COMMENT_REPORTED_MISLEADING = -3,
}
