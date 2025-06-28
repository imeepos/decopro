# @decopro/nakama

**Version**: 1.1.0

## Main Exports

- `ChannelMessage`

## Architecture Overview

This package contains the following components:

- **api**: 1 file(s)
- **interface**: 5 file(s)
- **module**: 3 file(s)
- **types**: 1 file(s)
- **utility**: 1 file(s)

### Key Dependencies

- **js-base64**: used in 5 file(s)
- **@decopro/core**: used in 3 file(s)
- **base64-arraybuffer**: used in 1 file(s)
- **tsup**: used in 1 file(s)


## API Reference

## Api

### src/api.gen.ts

### Interface: `FriendsOfFriendsListFriendOfFriend`

A friend of a friend.


  - referrer?: string
  - user?: ApiUser

### Interface: `GroupUserListGroupUser`

A single user-role pair.


  - state?: number
  - user?: ApiUser

### Interface: `UserGroupListUserGroup`

A single group-role pair.


  - group?: ApiGroup
  - state?: number

### Interface: `WriteLeaderboardRecordRequestLeaderboardRecordWrite`

Record values to write.


  - metadata?: string
  - operator?: ApiOperator
  - score?: string
  - subscore?: string

### Interface: `WriteTournamentRecordRequestTournamentRecordWrite`

Record values to write.


  - metadata?: string
  - operator?: ApiOperator
  - score?: string
  - subscore?: string

### Interface: `ApiAccount`

A user with additional account details. Always the current user.


  - custom_id?: string
  - devices?: Array<ApiAccountDevice>
  - disable_time?: string
  - email?: string
  - user?: ApiUser
  - verify_time?: string
  - wallet?: string

### Interface: `ApiAccountApple`

Send a Apple Sign In token to the server. Used with authenticate/link/unlink.


  - token?: string
  - vars?: Record<string, string>

### Interface: `ApiAccountCustom`

Send a custom ID to the server. Used with authenticate/link/unlink.


  - id?: string
  - vars?: Record<string, string>

### Interface: `ApiAccountDevice`

Send a device to the server. Used with authenticate/link/unlink and user.


  - id?: string
  - vars?: Record<string, string>

### Interface: `ApiAccountEmail`

Send an email with password to the server. Used with authenticate/link/unlink.


  - email?: string
  - password?: string
  - vars?: Record<string, string>

### Interface: `ApiAccountFacebook`

Send a Facebook token to the server. Used with authenticate/link/unlink.


  - token?: string
  - vars?: Record<string, string>

### Interface: `ApiAccountFacebookInstantGame`

Send a Facebook Instant Game token to the server. Used with authenticate/link/unlink.


  - signed_player_info?: string
  - vars?: Record<string, string>

### Interface: `ApiAccountGameCenter`

Send Apple's Game Center account credentials to the server. Used with authenticate/link/unlink.

https://developer.apple.com/documentation/gamekit/gklocalplayer/1515407-generateidentityverificationsign


  - bundle_id?: string
  - player_id?: string
  - public_key_url?: string
  - salt?: string
  - signature?: string
  - timestamp_seconds?: string
  - vars?: Record<string, string>

### Interface: `ApiAccountGoogle`

Send a Google token to the server. Used with authenticate/link/unlink.


  - token?: string
  - vars?: Record<string, string>

### Interface: `ApiAccountSteam`

Send a Steam token to the server. Used with authenticate/link/unlink.


  - token?: string
  - vars?: Record<string, string>

### Interface: `ApiChannelMessage`

A message sent on a channel.


  - channel_id?: string
  - code?: number
  - content?: string
  - create_time?: string
  - group_id?: string
  - message_id?: string
  - persistent?: boolean
  - room_name?: string
  - sender_id?: string
  - update_time?: string
  - user_id_one?: string
  - user_id_two?: string
  - username?: string

### Interface: `ApiChannelMessageList`

A list of channel messages, usually a result of a list operation.


  - cacheable_cursor?: string
  - messages?: Array<ApiChannelMessage>
  - next_cursor?: string
  - prev_cursor?: string

### Interface: `ApiCreateGroupRequest`

Create a group with the current user as owner.


  - avatar_url?: string
  - description?: string
  - lang_tag?: string
  - max_count?: number
  - name?: string
  - open?: boolean

### Interface: `ApiDeleteStorageObjectId`

Storage objects to delete.


  - collection?: string
  - key?: string
  - version?: string

### Interface: `ApiDeleteStorageObjectsRequest`

Batch delete storage objects.


  - object_ids?: Array<ApiDeleteStorageObjectId>

### Interface: `ApiEvent`

Represents an event to be passed through the server to registered event handlers.


  - external?: boolean
  - name?: string
  - properties?: Record<string, string>
  - timestamp?: string

### Interface: `ApiFriend`

A friend of a user.


  - state?: number
  - update_time?: string
  - user?: ApiUser

### Interface: `ApiFriendList`

A collection of zero or more friends of the user.


  - cursor?: string
  - friends?: Array<ApiFriend>

### Interface: `ApiFriendsOfFriendsList`
  - cursor?: string
  - friends_of_friends?: Array<FriendsOfFriendsListFriendOfFriend>

### Interface: `ApiGroup`

A group in the server.


  - avatar_url?: string
  - create_time?: string
  - creator_id?: string
  - description?: string
  - edge_count?: number
  - id?: string
  - lang_tag?: string
  - max_count?: number
  - metadata?: string
  - name?: string
  - open?: boolean
  - update_time?: string

### Interface: `ApiGroupList`

One or more groups returned from a listing operation.


  - cursor?: string
  - groups?: Array<ApiGroup>

### Interface: `ApiGroupUserList`

A list of users belonging to a group, along with their role.


  - cursor?: string
  - group_users?: Array<GroupUserListGroupUser>

### Interface: `ApiLeaderboardRecord`

Represents a complete leaderboard record with all scores and associated metadata.


  - create_time?: string
  - expiry_time?: string
  - leaderboard_id?: string
  - max_num_score?: number
  - metadata?: string
  - num_score?: number
  - owner_id?: string
  - rank?: string
  - score?: string
  - subscore?: string
  - update_time?: string
  - username?: string

### Interface: `ApiLeaderboardRecordList`

A set of leaderboard records, may be part of a leaderboard records page or a batch of individual records.


  - next_cursor?: string
  - owner_records?: Array<ApiLeaderboardRecord>
  - prev_cursor?: string
  - rank_count?: string
  - records?: Array<ApiLeaderboardRecord>

### Interface: `ApiLinkSteamRequest`

Link Steam to the current user's account.


  - account?: ApiAccountSteam
  - sync?: boolean

### Interface: `ApiListSubscriptionsRequest`

List user subscriptions.


  - cursor?: string
  - limit?: number

### Interface: `ApiMatch`

Represents a realtime match.


  - authoritative?: boolean
  - handler_name?: string
  - label?: string
  - match_id?: string
  - size?: number
  - tick_rate?: number

### Interface: `ApiMatchList`

A list of realtime matches.


  - matches?: Array<ApiMatch>

### Interface: `ApiNotification`

A notification in the server.


  - code?: number
  - content?: string
  - create_time?: string
  - id?: string
  - persistent?: boolean
  - sender_id?: string
  - subject?: string

### Interface: `ApiNotificationList`

A collection of zero or more notifications.


  - cacheable_cursor?: string
  - notifications?: Array<ApiNotification>

### Enum: `ApiOperator`

Operator that can be used to override the one set in the leaderboard.


  - Member: `NO_OVERRIDE`
  - Member: `BEST`
  - Member: `SET`
  - Member: `INCREMENT`
  - Member: `DECREMENT`
### Interface: `ApiReadStorageObjectId`

Storage objects to get.


  - collection?: string
  - key?: string
  - user_id?: string

### Interface: `ApiReadStorageObjectsRequest`

Batch get storage objects.


  - object_ids?: Array<ApiReadStorageObjectId>

### Interface: `ApiRpc`

Execute an Lua function on the server.


  - http_key?: string
  - id?: string
  - payload?: string

### Interface: `ApiSession`

A user's session used to authenticate messages.


  - created?: boolean
  - refresh_token?: string
  - token?: string

### Interface: `ApiSessionLogoutRequest`

Log out a session, invalidate a refresh token, or log out all sessions/refresh tokens for a user.


  - refresh_token?: string
  - token?: string

### Interface: `ApiSessionRefreshRequest`

Authenticate against the server with a refresh token.


  - token?: string
  - vars?: Record<string, string>

### Interface: `ApiStorageObject`

An object within the storage engine.


  - collection?: string
  - create_time?: string
  - key?: string
  - permission_read?: number
  - permission_write?: number
  - update_time?: string
  - user_id?: string
  - value?: string
  - version?: string

### Interface: `ApiStorageObjectAck`

A storage acknowledgement.


  - collection?: string
  - create_time?: string
  - key?: string
  - update_time?: string
  - user_id?: string
  - version?: string

### Interface: `ApiStorageObjectAcks`

Batch of acknowledgements for the storage object write.


  - acks?: Array<ApiStorageObjectAck>

### Interface: `ApiStorageObjectList`

List of storage objects.


  - cursor?: string
  - objects?: Array<ApiStorageObject>

### Interface: `ApiStorageObjects`

Batch of storage objects.


  - objects?: Array<ApiStorageObject>

### Enum: `ApiStoreEnvironment`

Environment where a purchase/subscription took place,


  - Member: `UNKNOWN`
  - Member: `SANDBOX`
  - Member: `PRODUCTION`
### Enum: `ApiStoreProvider`

Validation Provider,


  - Member: `APPLE_APP_STORE`
  - Member: `GOOGLE_PLAY_STORE`
  - Member: `HUAWEI_APP_GALLERY`
  - Member: `FACEBOOK_INSTANT_STORE`
### Interface: `ApiSubscriptionList`

A list of validated subscriptions stored by Nakama.


  - cursor?: string
  - prev_cursor?: string
  - validated_subscriptions?: Array<ApiValidatedSubscription>

### Interface: `ApiTournament`

A tournament on the server.


  - authoritative?: boolean
  - can_enter?: boolean
  - category?: number
  - create_time?: string
  - description?: string
  - duration?: number
  - end_active?: number
  - end_time?: string
  - id?: string
  - max_num_score?: number
  - max_size?: number
  - metadata?: string
  - next_reset?: number
  - operator?: ApiOperator
  - prev_reset?: number
  - size?: number
  - sort_order?: number
  - start_active?: number
  - start_time?: string
  - title?: string

### Interface: `ApiTournamentList`

A list of tournaments.


  - cursor?: string
  - tournaments?: Array<ApiTournament>

### Interface: `ApiTournamentRecordList`

A set of tournament records which may be part of a tournament records page or a batch of individual records.


  - next_cursor?: string
  - owner_records?: Array<ApiLeaderboardRecord>
  - prev_cursor?: string
  - rank_count?: string
  - records?: Array<ApiLeaderboardRecord>

### Interface: `ApiUpdateAccountRequest`

Update a user's account details.


  - avatar_url?: string
  - display_name?: string
  - lang_tag?: string
  - location?: string
  - timezone?: string
  - username?: string

### Interface: `ApiUpdateGroupRequest`

Update fields in a given group.


  - avatar_url?: string
  - description?: string
  - group_id?: string
  - lang_tag?: string
  - name?: string
  - open?: boolean

### Interface: `ApiUser`

A user in the server.


  - apple_id?: string
  - avatar_url?: string
  - create_time?: string
  - display_name?: string
  - edge_count?: number
  - facebook_id?: string
  - facebook_instant_game_id?: string
  - gamecenter_id?: string
  - google_id?: string
  - id?: string
  - lang_tag?: string
  - location?: string
  - metadata?: string
  - online?: boolean
  - steam_id?: string
  - timezone?: string
  - update_time?: string
  - username?: string

### Interface: `ApiUserGroupList`

A list of groups belonging to a user, along with the user's role in each group.


  - cursor?: string
  - user_groups?: Array<UserGroupListUserGroup>

### Interface: `ApiUsers`

A collection of zero or more users.


  - users?: Array<ApiUser>

### Interface: `ApiValidatePurchaseAppleRequest`
  - persist?: boolean
  - receipt?: string

### Interface: `ApiValidatePurchaseFacebookInstantRequest`
  - persist?: boolean
  - signed_request?: string

### Interface: `ApiValidatePurchaseGoogleRequest`
  - persist?: boolean
  - purchase?: string

### Interface: `ApiValidatePurchaseHuaweiRequest`
  - persist?: boolean
  - purchase?: string
  - signature?: string

### Interface: `ApiValidatePurchaseResponse`

Validate IAP response.


  - validated_purchases?: Array<ApiValidatedPurchase>

### Interface: `ApiValidateSubscriptionAppleRequest`
  - persist?: boolean
  - receipt?: string

### Interface: `ApiValidateSubscriptionGoogleRequest`
  - persist?: boolean
  - receipt?: string

### Interface: `ApiValidateSubscriptionResponse`

Validate Subscription response.


  - validated_subscription?: ApiValidatedSubscription

### Interface: `ApiValidatedPurchase`

Validated Purchase stored by Nakama.


  - create_time?: string
  - environment?: ApiStoreEnvironment
  - product_id?: string
  - provider_response?: string
  - purchase_time?: string
  - refund_time?: string
  - seen_before?: boolean
  - store?: ApiStoreProvider
  - transaction_id?: string
  - update_time?: string
  - user_id?: string

### Interface: `ApiValidatedSubscription`
  - active?: boolean
  - create_time?: string
  - environment?: ApiStoreEnvironment
  - expiry_time?: string
  - original_transaction_id?: string
  - product_id?: string
  - provider_notification?: string
  - provider_response?: string
  - purchase_time?: string
  - refund_time?: string
  - store?: ApiStoreProvider
  - update_time?: string
  - user_id?: string

### Interface: `ApiWriteStorageObject`

The object to store.


  - collection?: string
  - key?: string
  - permission_read?: number
  - permission_write?: number
  - value?: string
  - version?: string

### Interface: `ApiWriteStorageObjectsRequest`

Write objects to the storage engine.


  - objects?: Array<ApiWriteStorageObject>

### Class: `NakamaApi`
  - Constructor: `constructor(serverKey: string, basePath: string, timeoutMs: number): void`
    - Parameter: `serverKey: string`
    - Parameter: `basePath: string`
    - Parameter: `timeoutMs: number`
  - Method: `healthcheck(bearerToken: string, options: any): Promise<any>`
    
    A healthcheck which load balancers can use to check the service.
    
  - Method: `deleteAccount(bearerToken: string, options: any): Promise<any>`
    
    Delete the current user's account.
    
  - Method: `getAccount(bearerToken: string, options: any): Promise<ApiAccount>`
    
    Fetch the current user's account.
    
  - Method: `updateAccount(bearerToken: string, body: ApiUpdateAccountRequest, options: any): Promise<any>`
    
    Update fields in the current user's account.
    
  - Method: `authenticateApple(basicAuthUsername: string, basicAuthPassword: string, account: ApiAccountApple, create?: boolean, username?: string, options: any): Promise<ApiSession>`
    
    Authenticate a user with an Apple ID against the server.
    
  - Method: `authenticateCustom(basicAuthUsername: string, basicAuthPassword: string, account: ApiAccountCustom, create?: boolean, username?: string, options: any): Promise<ApiSession>`
    
    Authenticate a user with a custom id against the server.
    
  - Method: `authenticateDevice(basicAuthUsername: string, basicAuthPassword: string, account: ApiAccountDevice, create?: boolean, username?: string, options: any): Promise<ApiSession>`
    
    Authenticate a user with a device id against the server.
    
  - Method: `authenticateEmail(basicAuthUsername: string, basicAuthPassword: string, account: ApiAccountEmail, create?: boolean, username?: string, options: any): Promise<ApiSession>`
    
    Authenticate a user with an email+password against the server.
    
  - Method: `authenticateFacebook(basicAuthUsername: string, basicAuthPassword: string, account: ApiAccountFacebook, create?: boolean, username?: string, sync?: boolean, options: any): Promise<ApiSession>`
    
    Authenticate a user with a Facebook OAuth token against the server.
    
  - Method: `authenticateFacebookInstantGame(basicAuthUsername: string, basicAuthPassword: string, account: ApiAccountFacebookInstantGame, create?: boolean, username?: string, options: any): Promise<ApiSession>`
    
    Authenticate a user with a Facebook Instant Game token against the server.
    
  - Method: `authenticateGameCenter(basicAuthUsername: string, basicAuthPassword: string, account: ApiAccountGameCenter, create?: boolean, username?: string, options: any): Promise<ApiSession>`
    
    Authenticate a user with Apple's GameCenter against the server.
    
  - Method: `authenticateGoogle(basicAuthUsername: string, basicAuthPassword: string, account: ApiAccountGoogle, create?: boolean, username?: string, options: any): Promise<ApiSession>`
    
    Authenticate a user with Google against the server.
    
  - Method: `authenticateSteam(basicAuthUsername: string, basicAuthPassword: string, account: ApiAccountSteam, create?: boolean, username?: string, sync?: boolean, options: any): Promise<ApiSession>`
    
    Authenticate a user with Steam against the server.
    
  - Method: `linkApple(bearerToken: string, body: ApiAccountApple, options: any): Promise<any>`
    
    Add an Apple ID to the social profiles on the current user's account.
    
  - Method: `linkCustom(bearerToken: string, body: ApiAccountCustom, options: any): Promise<any>`
    
    Add a custom ID to the social profiles on the current user's account.
    
  - Method: `linkDevice(bearerToken: string, body: ApiAccountDevice, options: any): Promise<any>`
    
    Add a device ID to the social profiles on the current user's account.
    
  - Method: `linkEmail(bearerToken: string, body: ApiAccountEmail, options: any): Promise<any>`
    
    Add an email+password to the social profiles on the current user's account.
    
  - Method: `linkFacebook(bearerToken: string, account: ApiAccountFacebook, sync?: boolean, options: any): Promise<any>`
    
    Add Facebook to the social profiles on the current user's account.
    
  - Method: `linkFacebookInstantGame(bearerToken: string, body: ApiAccountFacebookInstantGame, options: any): Promise<any>`
    
    Add Facebook Instant Game to the social profiles on the current user's account.
    
  - Method: `linkGameCenter(bearerToken: string, body: ApiAccountGameCenter, options: any): Promise<any>`
    
    Add Apple's GameCenter to the social profiles on the current user's account.
    
  - Method: `linkGoogle(bearerToken: string, body: ApiAccountGoogle, options: any): Promise<any>`
    
    Add Google to the social profiles on the current user's account.
    
  - Method: `linkSteam(bearerToken: string, body: ApiLinkSteamRequest, options: any): Promise<any>`
    
    Add Steam to the social profiles on the current user's account.
    
  - Method: `sessionRefresh(basicAuthUsername: string, basicAuthPassword: string, body: ApiSessionRefreshRequest, options: any): Promise<ApiSession>`
    
    Refresh a user's session using a refresh token retrieved from a previous authentication request.
    
  - Method: `unlinkApple(bearerToken: string, body: ApiAccountApple, options: any): Promise<any>`
    
    Remove the Apple ID from the social profiles on the current user's account.
    
  - Method: `unlinkCustom(bearerToken: string, body: ApiAccountCustom, options: any): Promise<any>`
    
    Remove the custom ID from the social profiles on the current user's account.
    
  - Method: `unlinkDevice(bearerToken: string, body: ApiAccountDevice, options: any): Promise<any>`
    
    Remove the device ID from the social profiles on the current user's account.
    
  - Method: `unlinkEmail(bearerToken: string, body: ApiAccountEmail, options: any): Promise<any>`
    
    Remove the email+password from the social profiles on the current user's account.
    
  - Method: `unlinkFacebook(bearerToken: string, body: ApiAccountFacebook, options: any): Promise<any>`
    
    Remove Facebook from the social profiles on the current user's account.
    
  - Method: `unlinkFacebookInstantGame(bearerToken: string, body: ApiAccountFacebookInstantGame, options: any): Promise<any>`
    
    Remove Facebook Instant Game profile from the social profiles on the current user's account.
    
  - Method: `unlinkGameCenter(bearerToken: string, body: ApiAccountGameCenter, options: any): Promise<any>`
    
    Remove Apple's GameCenter from the social profiles on the current user's account.
    
  - Method: `unlinkGoogle(bearerToken: string, body: ApiAccountGoogle, options: any): Promise<any>`
    
    Remove Google from the social profiles on the current user's account.
    
  - Method: `unlinkSteam(bearerToken: string, body: ApiAccountSteam, options: any): Promise<any>`
    
    Remove Steam from the social profiles on the current user's account.
    
  - Method: `listChannelMessages(bearerToken: string, channelId: string, limit?: number, forward?: boolean, cursor?: string, options: any): Promise<ApiChannelMessageList>`
    
    List a channel's message history.
    
  - Method: `event(bearerToken: string, body: ApiEvent, options: any): Promise<any>`
    
    Submit an event for processing in the server's registered runtime custom events handler.
    
  - Method: `deleteFriends(bearerToken: string, ids?: Array<string>, usernames?: Array<string>, options: any): Promise<any>`
    
    Delete one or more users by ID or username.
    
  - Method: `listFriends(bearerToken: string, limit?: number, state?: number, cursor?: string, options: any): Promise<ApiFriendList>`
    
    List all friends for the current user.
    
  - Method: `addFriends(bearerToken: string, ids?: Array<string>, usernames?: Array<string>, options: any): Promise<any>`
    
    Add friends by ID or username to a user's account.
    
  - Method: `blockFriends(bearerToken: string, ids?: Array<string>, usernames?: Array<string>, options: any): Promise<any>`
    
    Block one or more users by ID or username.
    
  - Method: `importFacebookFriends(bearerToken: string, account: ApiAccountFacebook, reset?: boolean, options: any): Promise<any>`
    
    Import Facebook friends and add them to a user's account.
    
  - Method: `listFriendsOfFriends(bearerToken: string, limit?: number, cursor?: string, options: any): Promise<ApiFriendsOfFriendsList>`
    
    List friends of friends for the current user.
    
  - Method: `importSteamFriends(bearerToken: string, account: ApiAccountSteam, reset?: boolean, options: any): Promise<any>`
    
    Import Steam friends and add them to a user's account.
    
  - Method: `listGroups(bearerToken: string, name?: string, cursor?: string, limit?: number, langTag?: string, members?: number, open?: boolean, options: any): Promise<ApiGroupList>`
    
    List groups based on given filters.
    
  - Method: `createGroup(bearerToken: string, body: ApiCreateGroupRequest, options: any): Promise<ApiGroup>`
    
    Create a new group with the current user as the owner.
    
  - Method: `deleteGroup(bearerToken: string, groupId: string, options: any): Promise<any>`
    
    Delete a group by ID.
    
  - Method: `updateGroup(bearerToken: string, groupId: string, body: ApiUpdateGroupRequest, options: any): Promise<any>`
    
    Update fields in a given group.
    
  - Method: `addGroupUsers(bearerToken: string, groupId: string, userIds?: Array<string>, options: any): Promise<any>`
    
    Add users to a group.
    
  - Method: `banGroupUsers(bearerToken: string, groupId: string, userIds?: Array<string>, options: any): Promise<any>`
    
    Ban a set of users from a group.
    
  - Method: `demoteGroupUsers(bearerToken: string, groupId: string, userIds?: Array<string>, options: any): Promise<any>`
    
    Demote a set of users in a group to the next role down.
    
  - Method: `joinGroup(bearerToken: string, groupId: string, options: any): Promise<any>`
    
    Immediately join an open group, or request to join a closed one.
    
  - Method: `kickGroupUsers(bearerToken: string, groupId: string, userIds?: Array<string>, options: any): Promise<any>`
    
    Kick a set of users from a group.
    
  - Method: `leaveGroup(bearerToken: string, groupId: string, options: any): Promise<any>`
    
    Leave a group the user is a member of.
    
  - Method: `promoteGroupUsers(bearerToken: string, groupId: string, userIds?: Array<string>, options: any): Promise<any>`
    
    Promote a set of users in a group to the next role up.
    
  - Method: `listGroupUsers(bearerToken: string, groupId: string, limit?: number, state?: number, cursor?: string, options: any): Promise<ApiGroupUserList>`
    
    List all users that are part of a group.
    
  - Method: `validatePurchaseApple(bearerToken: string, body: ApiValidatePurchaseAppleRequest, options: any): Promise<ApiValidatePurchaseResponse>`
    
    Validate Apple IAP Receipt
    
  - Method: `validatePurchaseFacebookInstant(bearerToken: string, body: ApiValidatePurchaseFacebookInstantRequest, options: any): Promise<ApiValidatePurchaseResponse>`
    
    Validate FB Instant IAP Receipt
    
  - Method: `validatePurchaseGoogle(bearerToken: string, body: ApiValidatePurchaseGoogleRequest, options: any): Promise<ApiValidatePurchaseResponse>`
    
    Validate Google IAP Receipt
    
  - Method: `validatePurchaseHuawei(bearerToken: string, body: ApiValidatePurchaseHuaweiRequest, options: any): Promise<ApiValidatePurchaseResponse>`
    
    Validate Huawei IAP Receipt
    
  - Method: `listSubscriptions(bearerToken: string, body: ApiListSubscriptionsRequest, options: any): Promise<ApiSubscriptionList>`
    
    List user's subscriptions.
    
  - Method: `validateSubscriptionApple(bearerToken: string, body: ApiValidateSubscriptionAppleRequest, options: any): Promise<ApiValidateSubscriptionResponse>`
    
    Validate Apple Subscription Receipt
    
  - Method: `validateSubscriptionGoogle(bearerToken: string, body: ApiValidateSubscriptionGoogleRequest, options: any): Promise<ApiValidateSubscriptionResponse>`
    
    Validate Google Subscription Receipt
    
  - Method: `getSubscription(bearerToken: string, productId: string, options: any): Promise<ApiValidatedSubscription>`
    
    Get subscription by product id.
    
  - Method: `deleteLeaderboardRecord(bearerToken: string, leaderboardId: string, options: any): Promise<any>`
    
    Delete a leaderboard record.
    
  - Method: `listLeaderboardRecords(bearerToken: string, leaderboardId: string, ownerIds?: Array<string>, limit?: number, cursor?: string, expiry?: string, options: any): Promise<ApiLeaderboardRecordList>`
    
    List leaderboard records.
    
  - Method: `writeLeaderboardRecord(bearerToken: string, leaderboardId: string, record: WriteLeaderboardRecordRequestLeaderboardRecordWrite, options: any): Promise<ApiLeaderboardRecord>`
    
    Write a record to a leaderboard.
    
  - Method: `listLeaderboardRecordsAroundOwner(bearerToken: string, leaderboardId: string, ownerId: string, limit?: number, expiry?: string, cursor?: string, options: any): Promise<ApiLeaderboardRecordList>`
    
    List leaderboard records that belong to a user.
    
  - Method: `listMatches(bearerToken: string, limit?: number, authoritative?: boolean, label?: string, minSize?: number, maxSize?: number, query?: string, options: any): Promise<ApiMatchList>`
    
    Fetch list of running matches.
    
  - Method: `deleteNotifications(bearerToken: string, ids?: Array<string>, options: any): Promise<any>`
    
    Delete one or more notifications for the current user.
    
  - Method: `listNotifications(bearerToken: string, limit?: number, cacheableCursor?: string, options: any): Promise<ApiNotificationList>`
    
    Fetch list of notifications.
    
  - Method: `rpcFunc2(bearerToken: string, id: string, payload?: string, httpKey?: string, options: any): Promise<ApiRpc>`
    
    Execute a Lua function on the server.
    
  - Method: `rpcFunc(bearerToken: string, id: string, body: string, httpKey?: string, options: any): Promise<ApiRpc>`
    
    Execute a Lua function on the server.
    
  - Method: `sessionLogout(bearerToken: string, body: ApiSessionLogoutRequest, options: any): Promise<any>`
    
    Log out a session, invalidate a refresh token, or log out all sessions/refresh tokens for a user.
    
  - Method: `readStorageObjects(bearerToken: string, body: ApiReadStorageObjectsRequest, options: any): Promise<ApiStorageObjects>`
    
    Get storage objects.
    
  - Method: `writeStorageObjects(bearerToken: string, body: ApiWriteStorageObjectsRequest, options: any): Promise<ApiStorageObjectAcks>`
    
    Write objects into the storage engine.
    
  - Method: `deleteStorageObjects(bearerToken: string, body: ApiDeleteStorageObjectsRequest, options: any): Promise<any>`
    
    Delete one or more objects by ID or username.
    
  - Method: `listStorageObjects(bearerToken: string, collection: string, userId?: string, limit?: number, cursor?: string, options: any): Promise<ApiStorageObjectList>`
    
    List publicly readable storage objects in a given collection.
    
  - Method: `listStorageObjects2(bearerToken: string, collection: string, userId: string, limit?: number, cursor?: string, options: any): Promise<ApiStorageObjectList>`
    
    List publicly readable storage objects in a given collection.
    
  - Method: `listTournaments(bearerToken: string, categoryStart?: number, categoryEnd?: number, startTime?: number, endTime?: number, limit?: number, cursor?: string, options: any): Promise<ApiTournamentList>`
    
    List current or upcoming tournaments.
    
  - Method: `deleteTournamentRecord(bearerToken: string, tournamentId: string, options: any): Promise<any>`
    
    Delete a tournament record.
    
  - Method: `listTournamentRecords(bearerToken: string, tournamentId: string, ownerIds?: Array<string>, limit?: number, cursor?: string, expiry?: string, options: any): Promise<ApiTournamentRecordList>`
    
    List tournament records.
    
  - Method: `writeTournamentRecord2(bearerToken: string, tournamentId: string, record: WriteTournamentRecordRequestTournamentRecordWrite, options: any): Promise<ApiLeaderboardRecord>`
    
    Write a record to a tournament.
    
  - Method: `writeTournamentRecord(bearerToken: string, tournamentId: string, record: WriteTournamentRecordRequestTournamentRecordWrite, options: any): Promise<ApiLeaderboardRecord>`
    
    Write a record to a tournament.
    
  - Method: `joinTournament(bearerToken: string, tournamentId: string, options: any): Promise<any>`
    
    Attempt to join an open and running tournament.
    
  - Method: `listTournamentRecordsAroundOwner(bearerToken: string, tournamentId: string, ownerId: string, limit?: number, expiry?: string, cursor?: string, options: any): Promise<ApiTournamentRecordList>`
    
    List tournament records for a given owner.
    
  - Method: `getUsers(bearerToken: string, ids?: Array<string>, usernames?: Array<string>, facebookIds?: Array<string>, options: any): Promise<ApiUsers>`
    
    Fetch zero or more users by ID and/or username.
    
  - Method: `listUserGroups(bearerToken: string, userId: string, limit?: number, state?: number, cursor?: string, options: any): Promise<ApiUserGroupList>`
    
    List groups the current user belongs to.
    
  - Method: `buildFullUrl(basePath: string, fragment: string, queryParams: Map<string, any>): void`


**Tags**: async, interface, types, class, function, export

## Interface

### src/client.ts

### Interface: `RpcResponse`

Response for an RPC function executed on the server.


  - id?: string
    
    The identifier of the function.
    
  - payload?: object
    
    The payload of the function which must be a JSON object.
    

### Interface: `LeaderboardRecord`

Represents a complete leaderboard record with all scores and associated metadata.


  - create_time?: string
    
    The UNIX time when the leaderboard record was created.
    
  - expiry_time?: string
    
    The UNIX time when the leaderboard record expires.
    
  - leaderboard_id?: string
    
    The ID of the leaderboard this score belongs to.
    
  - metadata?: object
    
    Metadata.
    
  - num_score?: number
    
    The number of submissions to this score record.
    
  - owner_id?: string
    
    The ID of the score owner, usually a user or group.
    
  - rank?: number
    
    The rank of this record.
    
  - score?: number
    
    The score value.
    
  - subscore?: number
    
    An optional subscore value.
    
  - update_time?: string
    
    The UNIX time when the leaderboard record was updated.
    
  - username?: string
    
    The username of the score owner, if the owner is a user.
    
  - max_num_score?: number
    
    The maximum number of score updates allowed by the owner.
    

### Interface: `LeaderboardRecordList`

A set of leaderboard records, may be part of a leaderboard records page or a batch of individual records.


  - next_cursor?: string
    
    The cursor to send when retrieving the next page, if any.
    
  - owner_records?: Array<LeaderboardRecord>
    
    A batched set of leaderboard records belonging to specified owners.
    
  - prev_cursor?: string
    
    The cursor to send when retrieving the previous page, if any.
    
  - rank_count?: number
  - records?: Array<LeaderboardRecord>
    
    A list of leaderboard records.
    

### Interface: `Tournament`

A Tournament on the server.


  - authoritative?: boolean
    
    Whether the leaderboard was created authoritatively or not.
    
  - id?: string
    
    The ID of the tournament.
    
  - title?: string
    
    The title for the tournament.
    
  - description?: string
    
    The description of the tournament. May be blank.
    
  - duration?: number
    
    The UNIX timestamp for duration of a tournament.
    
  - category?: number
    
    The category of the tournament. e.g. "vip" could be category 1.
    
  - sort_order?: number
    
    ASC or DESC sort mode of scores in the tournament.
    
  - size?: number
    
    The current number of players in the tournament.
    
  - max_size?: number
    
    The maximum number of players for the tournament.
    
  - max_num_score?: number
    
    The maximum score updates allowed per player for the current tournament.
    
  - can_enter?: boolean
    
    True if the tournament is active and can enter. A computed value.
    
  - end_active?: number
    
    The UNIX timestamp when the tournament stops being active until next reset. A computed value.
    
  - next_reset?: number
    
    The UNIX timestamp when the tournament is next playable. A computed value.
    
  - metadata?: object
    
    Additional information stored as a JSON object.
    
  - create_time?: string
    
    The UNIX time when the tournament was created.
    
  - start_time?: string
    
    The UNIX time when the tournament will start.
    
  - end_time?: string
    
    The UNIX time when the tournament will be stopped.
    
  - start_active?: number
    
    The UNIX time when the tournament start being active. A computed value.
    

### Interface: `TournamentList`

A list of tournaments.


  - tournaments?: Array<Tournament>
    
    The list of tournaments returned.
    
  - cursor?: string
    
    A pagination cursor (optional).
    

### Interface: `TournamentRecordList`

A set of tournament records, may be part of a tournament records page or a batch of individual records.


  - next_cursor?: string
    
    The cursor to send when retireving the next page, if any.
    
  - owner_records?: Array<LeaderboardRecord>
    
    A batched set of tournament records belonging to specified owners.
    
  - prev_cursor?: string
    
    The cursor to send when retrieving the previous page, if any.
    
  - records?: Array<LeaderboardRecord>
    
    A list of tournament records.
    

### Interface: `WriteTournamentRecord`

Record values to write.


  - metadata?: object
    
    Optional record metadata.
    
  - score?: string
    
    The score value to submit.
    
  - subscore?: string
    
    An optional secondary value.
    

### Interface: `WriteLeaderboardRecord`

Record values to write.


  - metadata?: object
    
    Optional record metadata.
    
  - score?: string
    
    The score value to submit.
    
  - subscore?: string
    
    An optional secondary value.
    

### Interface: `WriteStorageObject`

The object to store.


  - collection?: string
    
    The collection to store the object.
    
  - key?: string
    
    The key for the object within the collection.
    
  - permission_read?: number
    
    The read access permissions for the object.
    
  - permission_write?: number
    
    The write access permissions for the object.
    
  - value?: object
    
    The value of the object.
    
  - version?: string
    
    The version hash of the object to check. Possible values are: ["", "*", "#hash#"].
    

### Interface: `StorageObject`

An object within the storage engine.


  - collection?: string
    
    The collection which stores the object.
    
  - create_time?: string
    
    The UNIX time when the object was created.
    
  - key?: string
    
    The key of the object within the collection.
    
  - permission_read?: number
    
    The read access permissions for the object.
    
  - permission_write?: number
    
    The write access permissions for the object.
    
  - update_time?: string
    
    The UNIX time when the object was last updated.
    
  - user_id?: string
    
    The user owner of the object.
    
  - value?: object
    
    The value of the object.
    
  - version?: string
    
    The version hash of the object.
    

### Interface: `StorageObjectList`

List of storage objects.


  - cursor?: string
    
    The cursor associated with the query a page of results.
    
  - objects: Array<StorageObject>
    
    The list of storage objects.
    

### Interface: `StorageObjects`

Batch of storage objects.


  - objects: Array<StorageObject>
    
    The batch of storage objects.
    

### Interface: `ChannelMessage`

A message sent on a channel.


  - channel_id?: string
    
    The channel this message belongs to.
    
  - code?: number
    
    The code representing a message type or category.
    
  - content?: object
    
    The content payload.
    
  - create_time?: string
    
    The UNIX time when the message was created.
    
  - group_id?: string
    
    The ID of the group, or an empty string if this message was not sent through a group channel.
    
  - message_id?: string
    
    The unique ID of this message.
    
  - persistent?: boolean
    
    True if the message was persisted to the channel's history, false otherwise.
    
  - room_name?: string
    
    The name of the chat room, or an empty string if this message was not sent through a chat room.
    
  - reference_id?: string
    
    Another message ID reference, if any.
    
  - sender_id?: string
    
    Message sender, usually a user ID.
    
  - update_time?: string
    
    The UNIX time when the message was last updated.
    
  - user_id_one?: string
    
    The ID of the first DM user, or an empty string if this message was not sent through a DM chat.
    
  - user_id_two?: string
    
    The ID of the second DM user, or an empty string if this message was not sent through a DM chat.
    
  - username?: string
    
    The username of the message sender, if any.
    

### Interface: `ChannelMessageList`

A list of channel messages, usually a result of a list operation.


  - cacheable_cursor?: string
    
    Cacheable cursor to list newer messages. Durable and designed to be stored, unlike next/prev cursors.
    
  - messages?: Array<ChannelMessage>
    
    A list of messages.
    
  - next_cursor?: string
    
    The cursor to send when retireving the next page, if any.
    
  - prev_cursor?: string
    
    The cursor to send when retrieving the previous page, if any.
    

### Interface: `User`

A user in the system.


  - avatar_url?: string
    
    A URL for an avatar image.
    
  - create_time?: string
    
    The UNIX time when the user was created.
    
  - display_name?: string
    
    The display name of the user.
    
  - edge_count?: number
    
    Number of related edges to this user.
    
  - facebook_id?: string
    
    The Facebook id in the user's account.
    
  - facebook_instant_game_id?: string
    
    The Facebook Instant Game ID in the user's account.
    
  - gamecenter_id?: string
    
    The Apple Game Center in of the user's account.
    
  - google_id?: string
    
    The Google id in the user's account.
    
  - id?: string
    
    The id of the user's account.
    
  - lang_tag?: string
    
    The language expected to be a tag which follows the BCP-47 spec.
    
  - location?: string
    
    The location set by the user.
    
  - metadata?: {}
    
    Additional information stored as a JSON object.
    
  - online?: boolean
    
    Indicates whether the user is currently online.
    
  - steam_id?: string
    
    The Steam id in the user's account.
    
  - timezone?: string
    
    The timezone set by the user.
    
  - update_time?: string
    
    The UNIX time when the user was last updated.
    
  - username?: string
    
    The username of the user's account.
    

### Interface: `Users`

A collection of zero or more users.


  - users?: Array<User>
    
    The User objects.
    

### Interface: `Friend`

A friend of a user.


  - state?: number
    
    The friend status.
    
  - user?: User
    
    The user object.
    

### Interface: `Friends`

A collection of zero or more friends of the user.


  - friends?: Array<Friend>
    
    The Friend objects.
    
  - cursor?: string
    
    Cursor for the next page of results, if any.
    

### Interface: `FriendOfFriend`

A friend of a friend.


  - referrer?: string
  - user?: User

### Interface: `FriendsOfFriends`

Friends of the user's friends.


  - cursor?: string
  - friends_of_friends?: Array<FriendOfFriend>

### Interface: `GroupUser`

A user-role pair representing the user's role in a group.


  - user?: User
    
    The user.
    
  - state?: number
    
    Their role within the group.
    

### Interface: `GroupUserList`

A list of users belonging to a group along with their role in it.


  - group_users?: Array<GroupUser>
    
    The user-role pairs.
    
  - cursor?: string
    
    Cursor for the next page of results, if any.
    

### Interface: `Group`

A group in the server.


  - avatar_url?: string
    
    A URL for an avatar image.
    
  - create_time?: string
    
    The UNIX time when the group was created.
    
  - creator_id?: string
    
    The id of the user who created the group.
    
  - description?: string
    
    A description for the group.
    
  - edge_count?: number
    
    The current count of all members in the group.
    
  - id?: string
    
    The id of a group.
    
  - lang_tag?: string
    
    The language expected to be a tag which follows the BCP-47 spec.
    
  - max_count?: number
    
    The maximum number of members allowed.
    
  - metadata?: {}
    
    Additional information stored as a JSON object.
    
  - name?: string
    
    The unique name of the group.
    
  - open?: boolean
    
    Anyone can join open groups, otherwise only admins can accept members.
    
  - update_time?: string
    
    The UNIX time when the group was last updated.
    

### Interface: `GroupList`

One or more groups returned from a listing operation.


  - cursor?: string
    
    A cursor used to get the next page.
    
  - groups?: Array<Group>
    
    One or more groups.
    

### Interface: `UserGroup`

A group-role pair representing the user's groups and their role in each.


  - group?: Group
    
    The group.
    
  - state?: number
    
    The user's role within the group.
    

### Interface: `UserGroupList`

A list of groups belonging to a user along with their role in it.


  - user_groups?: Array<UserGroup>
    
    The group-role pairs.
    
  - cursor?: string
    
    Cursor for the next page of results, if any.
    

### Interface: `NotificationList`

A collection of zero or more notifications.


  - cacheable_cursor?: string
    
    Use this cursor to paginate notifications. Cache this to catch up to new notifications.
    
  - notifications?: Array<Notification>
    
    Collection of notifications.
    

### Interface: `ValidatedSubscription`
  - active?: boolean
  - create_time?: string
  - environment?: ApiStoreEnvironment
  - expiry_time?: string
  - original_transaction_id?: string
  - product_id?: string
  - provider_notification?: string
  - provider_response?: string
  - purchase_time?: string
  - refund_time?: string
  - store?: ApiStoreProvider
  - update_time?: string
  - user_id?: string

### Interface: `SubscriptionList`

A list of validated subscriptions stored by Nakama.


  - cursor?: string
  - prev_cursor?: string
  - validated_subscriptions?: Array<ValidatedSubscription>

### Class: `Client`

A client for Nakama server.


  - Property: `expiredTimespanMs: any`
    
    The expired timespan used to check session lifetime.
    
  - Property: `apiClient: NakamaApi`
    
    The low level API client for Nakama server.
    
  - Constructor: `constructor(serverkey: any, host: any, port: any, useSSL: any, timeout: any, autoRefreshSession: any): void`
    - Parameter: `serverkey: any`
    - Parameter: `host: any`
    - Parameter: `port: any`
    - Parameter: `useSSL: any`
    - Parameter: `timeout: any`
    - Parameter: `autoRefreshSession: any`
  - Method: `addGroupUsers(session: Session, groupId: string, ids?: Array<string>): Promise<boolean>`
    
    Add users to a group, or accept their join requests.
    
  - Method: `addFriends(session: Session, ids?: Array<string>, usernames?: Array<string>): Promise<boolean>`
    
    Add friends by ID or username to a user's account.
    
  - Method: `authenticateApple(token: string, create?: boolean, username?: string, vars: Record<string, string>, options: any): void`
    
    Authenticate a user with an Apple ID against the server.
    
  - Method: `authenticateCustom(id: string, create?: boolean, username?: string, vars: Record<string, string>, options: any): Promise<Session>`
    
    Authenticate a user with a custom id against the server.
    
  - Method: `authenticateDevice(id: string, create?: boolean, username?: string, vars?: Record<string, string>): Promise<Session>`
    
    Authenticate a user with a device id against the server.
    
  - Method: `authenticateEmail(email: string, password: string, create?: boolean, username?: string, vars?: Record<string, string>): Promise<Session>`
    
    Authenticate a user with an email+password against the server.
    
  - Method: `authenticateFacebookInstantGame(signedPlayerInfo: string, create?: boolean, username?: string, vars?: Record<string, string>, options: any): Promise<Session>`
    
    Authenticate a user with a Facebook Instant Game token against the server.
    
  - Method: `authenticateFacebook(token: string, create?: boolean, username?: string, sync?: boolean, vars?: Record<string, string>, options: any): Promise<Session>`
    
    Authenticate a user with a Facebook OAuth token against the server.
    
  - Method: `authenticateGoogle(token: string, create?: boolean, username?: string, vars?: Record<string, string>, options: any): Promise<Session>`
    
    Authenticate a user with Google against the server.
    
  - Method: `authenticateGameCenter(bundleId: string, playerId: string, publicKeyUrl: string, salt: string, signature: string, timestamp: string, username?: string, create?: boolean, vars?: Record<string, string>, options: any): Promise<Session>`
    
    Authenticate a user with GameCenter against the server.
    
  - Method: `authenticateSteam(token: string, create?: boolean, username?: string, sync?: boolean, vars?: Record<string, string>): Promise<Session>`
    
    Authenticate a user with Steam against the server.
    
  - Method: `banGroupUsers(session: Session, groupId: string, ids?: Array<string>): Promise<boolean>`
    
    Ban users from a group.
    
  - Method: `blockFriends(session: Session, ids?: Array<string>, usernames?: Array<string>): Promise<boolean>`
    
    Block one or more users by ID or username.
    
  - Method: `createGroup(session: Session, request: ApiCreateGroupRequest): Promise<Group>`
    
    Create a new group with the current user as the creator and superadmin.
    
  - Method: `createSocket(useSSL: any, verbose: boolean, adapter: WebSocketAdapter, sendTimeoutMs: number): Socket`
    
    A socket created with the client's configuration.
    
  - Method: `deleteAccount(session: Session): Promise<boolean>`
    
    Delete the current user's account.
    
  - Method: `deleteFriends(session: Session, ids?: Array<string>, usernames?: Array<string>): Promise<boolean>`
    
    Delete one or more users by ID or username.
    
  - Method: `deleteGroup(session: Session, groupId: string): Promise<boolean>`
    
    Delete a group the user is part of and has permissions to delete.
    
  - Method: `deleteNotifications(session: Session, ids?: Array<string>): Promise<boolean>`
    
    Delete one or more notifications
    
  - Method: `deleteStorageObjects(session: Session, request: ApiDeleteStorageObjectsRequest): Promise<boolean>`
    
    Delete one or more storage objects
    
  - Method: `deleteTournamentRecord(session: Session, tournamentId: string): Promise<any>`
    
    Delete a tournament record.
    
  - Method: `demoteGroupUsers(session: Session, groupId: string, ids: Array<string>): Promise<boolean>`
    
    Demote a set of users in a group to the next role down.
    
  - Method: `emitEvent(session: Session, request: ApiEvent): Promise<boolean>`
    
    Submit an event for processing in the server's registered runtime custom events handler.
    
  - Method: `getAccount(session: Session): Promise<ApiAccount>`
    
    Fetch the current user's account.
    
  - Method: `getSubscription(session: Session, productId: string): Promise<ApiValidatedSubscription>`
    
    Get subscription by product id.
    
  - Method: `importFacebookFriends(session: Session, request: ApiAccountFacebook): Promise<boolean>`
    
    Import Facebook friends and add them to a user's account.
    
  - Method: `importSteamFriends(session: Session, request: ApiAccountSteam, reset: boolean): Promise<boolean>`
    
    Import Steam friends and add them to a user's account.
    
  - Method: `getUsers(session: Session, ids?: Array<string>, usernames?: Array<string>, facebookIds?: Array<string>): Promise<Users>`
    
    Fetch zero or more users by ID and/or username.
    
  - Method: `joinGroup(session: Session, groupId: string): Promise<boolean>`
    
    Join a group that's open, or send a request to join a group that is closed.
    
  - Method: `joinTournament(session: Session, tournamentId: string): Promise<boolean>`
  - Method: `kickGroupUsers(session: Session, groupId: string, ids?: Array<string>): Promise<boolean>`
    
    Kick users from a group, or decline their join requests.
    
  - Method: `leaveGroup(session: Session, groupId: string): Promise<boolean>`
    
    Leave a group the user is part of.
    
  - Method: `listChannelMessages(session: Session, channelId: string, limit?: number, forward?: boolean, cursor?: string): Promise<ChannelMessageList>`
    
    List a channel's message history.
    
  - Method: `listGroupUsers(session: Session, groupId: string, state?: number, limit?: number, cursor?: string): Promise<GroupUserList>`
    
    List a group's users.
    
  - Method: `listUserGroups(session: Session, userId: string, state?: number, limit?: number, cursor?: string): Promise<UserGroupList>`
    
    List a user's groups.
    
  - Method: `listGroups(session: Session, name?: string, cursor?: string, limit?: number): Promise<GroupList>`
    
    List groups based on given filters.
    
  - Method: `linkApple(session: Session, request: ApiAccountApple): Promise<boolean>`
    
    Add an Apple ID to the social profiles on the current user's account.
    
  - Method: `linkCustom(session: Session, request: ApiAccountCustom): Promise<boolean>`
    
    Add a custom ID to the social profiles on the current user's account.
    
  - Method: `linkDevice(session: Session, request: ApiAccountDevice): Promise<boolean>`
    
    Add a device ID to the social profiles on the current user's account.
    
  - Method: `linkEmail(session: Session, request: ApiAccountEmail): Promise<boolean>`
    
    Add an email+password to the social profiles on the current user's account.
    
  - Method: `linkFacebook(session: Session, request: ApiAccountFacebook): Promise<boolean>`
    
    Add Facebook to the social profiles on the current user's account.
    
  - Method: `linkFacebookInstantGame(session: Session, request: ApiAccountFacebookInstantGame): Promise<boolean>`
    
    Add Facebook Instant to the social profiles on the current user's account.
    
  - Method: `linkGoogle(session: Session, request: ApiAccountGoogle): Promise<boolean>`
    
    Add Google to the social profiles on the current user's account.
    
  - Method: `linkGameCenter(session: Session, request: ApiAccountGameCenter): Promise<boolean>`
    
    Add GameCenter to the social profiles on the current user's account.
    
  - Method: `linkSteam(session: Session, request: ApiLinkSteamRequest): Promise<boolean>`
    
    Add Steam to the social profiles on the current user's account.
    
  - Method: `listFriends(session: Session, state?: number, limit?: number, cursor?: string): Promise<Friends>`
    
    List all friends for the current user.
    
  - Method: `listFriendsOfFriends(session: Session, limit?: number, cursor?: string): Promise<FriendsOfFriends>`
    
    List friends of friends for the current user.
    
  - Method: `listLeaderboardRecords(session: Session, leaderboardId: string, ownerIds?: Array<string>, limit?: number, cursor?: string, expiry?: string): Promise<LeaderboardRecordList>`
    
    List leaderboard records
    
  - Method: `listLeaderboardRecordsAroundOwner(session: Session, leaderboardId: string, ownerId: string, limit?: number, expiry?: string, cursor?: string): Promise<LeaderboardRecordList>`
  - Method: `listMatches(session: Session, limit?: number, authoritative?: boolean, label?: string, minSize?: number, maxSize?: number, query?: string): Promise<ApiMatchList>`
    
    Fetch list of running matches.
    
  - Method: `listNotifications(session: Session, limit?: number, cacheableCursor?: string): Promise<NotificationList>`
    
    Fetch list of notifications.
    
  - Method: `listStorageObjects(session: Session, collection: string, userId?: string, limit?: number, cursor?: string): Promise<StorageObjectList>`
    
    List storage objects.
    
  - Method: `listTournaments(session: Session, categoryStart?: number, categoryEnd?: number, startTime?: number, endTime?: number, limit?: number, cursor?: string): Promise<TournamentList>`
    
    List current or upcoming tournaments.
    
  - Method: `listSubscriptions(session: Session, cursor?: string, limit?: number): Promise<SubscriptionList>`
    
    List user subscriptions.
    
  - Method: `listTournamentRecords(session: Session, tournamentId: string, ownerIds?: Array<string>, limit?: number, cursor?: string, expiry?: string): Promise<TournamentRecordList>`
    
    List tournament records from a given tournament.
    
  - Method: `listTournamentRecordsAroundOwner(session: Session, tournamentId: string, ownerId: string, limit?: number, expiry?: string, cursor?: string): Promise<TournamentRecordList>`
    
    List tournament records from a given tournament around the owner.
    
  - Method: `promoteGroupUsers(session: Session, groupId: string, ids?: Array<string>): Promise<boolean>`
    
    Promote users in a group to the next role up.
    
  - Method: `readStorageObjects(session: Session, request: ApiReadStorageObjectsRequest): Promise<StorageObjects>`
    
    Fetch storage objects.
    
  - Method: `rpc(session: Session, id: string, input: object): Promise<RpcResponse>`
    
    Execute an RPC function on the server.
    
  - Method: `rpcHttpKey(httpKey: string, id: string, input?: object): Promise<RpcResponse>`
    
    Execute an RPC function on the server.
    
  - Method: `sessionLogout(session: Session, token: string, refreshToken: string): Promise<boolean>`
    
    Log out a session, invalidate a refresh token, or log out all sessions/refresh tokens for a user.
    
  - Method: `sessionRefresh(session: Session, vars: Record<string, string>): Promise<Session>`
    
    Refresh a user's session using a refresh token retrieved from a previous authentication request.
    
  - Method: `unlinkApple(session: Session, request: ApiAccountApple): Promise<boolean>`
    
    Remove the Apple ID from the social profiles on the current user's account.
    
  - Method: `unlinkCustom(session: Session, request: ApiAccountCustom): Promise<boolean>`
    
    Remove custom ID from the social profiles on the current user's account.
    
  - Method: `unlinkDevice(session: Session, request: ApiAccountDevice): Promise<boolean>`
    
    Remove a device ID from the social profiles on the current user's account.
    
  - Method: `unlinkEmail(session: Session, request: ApiAccountEmail): Promise<boolean>`
    
    Remove an email+password from the social profiles on the current user's account.
    
  - Method: `unlinkFacebook(session: Session, request: ApiAccountFacebook): Promise<boolean>`
    
    Remove Facebook from the social profiles on the current user's account.
    
  - Method: `unlinkFacebookInstantGame(session: Session, request: ApiAccountFacebookInstantGame): Promise<boolean>`
    
    Remove Facebook Instant social profiles from the current user's account.
    
  - Method: `unlinkGoogle(session: Session, request: ApiAccountGoogle): Promise<boolean>`
    
    Remove Google from the social profiles on the current user's account.
    
  - Method: `unlinkGameCenter(session: Session, request: ApiAccountGameCenter): Promise<boolean>`
    
    Remove GameCenter from the social profiles on the current user's account.
    
  - Method: `unlinkSteam(session: Session, request: ApiAccountSteam): Promise<boolean>`
    
    Remove Steam from the social profiles on the current user's account.
    
  - Method: `updateAccount(session: Session, request: ApiUpdateAccountRequest): Promise<boolean>`
    
    Update fields in the current user's account.
    
  - Method: `updateGroup(session: Session, groupId: string, request: ApiUpdateGroupRequest): Promise<boolean>`
    
    Update a group the user is part of and has permissions to update.
    
  - Method: `validatePurchaseApple(session: Session, receipt?: string, persist: boolean): Promise<ApiValidatePurchaseResponse>`
    
    Validate an Apple IAP receipt.
    
  - Method: `validatePurchaseFacebookInstant(session: Session, signedRequest?: string, persist: boolean): Promise<ApiValidatePurchaseResponse>`
    
    Validate a FB Instant IAP receipt.
    
  - Method: `validatePurchaseGoogle(session: Session, purchase?: string, persist: boolean): Promise<ApiValidatePurchaseResponse>`
    
    Validate a Google IAP receipt.
    
  - Method: `validatePurchaseHuawei(session: Session, purchase?: string, signature?: string, persist: boolean): Promise<ApiValidatePurchaseResponse>`
    
    Validate a Huawei IAP receipt.
    
  - Method: `validateSubscriptionApple(session: Session, receipt: string, persist: boolean): Promise<ApiValidateSubscriptionResponse>`
    
    Validate Apple Subscription Receipt
    
  - Method: `validateSubscriptionGoogle(session: Session, receipt: string, persist: boolean): Promise<ApiValidateSubscriptionResponse>`
    
    Validate Google Subscription Receipt
    
  - Method: `writeLeaderboardRecord(session: Session, leaderboardId: string, request: WriteLeaderboardRecord): Promise<LeaderboardRecord>`
    
    Write a record to a leaderboard.
    
  - Method: `writeStorageObjects(session: Session, objects: Array<WriteStorageObject>): Promise<ApiStorageObjectAcks>`
    
    Write storage objects.
    
  - Method: `writeTournamentRecord(session: Session, tournamentId: string, request: WriteTournamentRecord): Promise<LeaderboardRecord>`
    
    Write a record to a tournament.
    


**Tags**: cli, command, async, interface, types, class, function, export

### src/rpc.ts

### Interface: `AddAdminPlanRpcInput`
  - name: string
  - description?: string
  - price: number
  - duration: number
  - features?: string
  - settings?: any
  - groupId?: string

### Interface: `AddAdminPlanRpcOutput`
  - success: boolean
  - planId: string
  - groupId: string

### Class: `NakamaRpc`
  - Constructor: `constructor(client: Client, session: Session): void`
    - Parameter: `client: Client`
    - Parameter: `session: Session`
  - Method: `addAdminPlanRpc(input: AddAdminPlanRpcInput): Promise<AddAdminPlanRpcOutput | undefined>`


**Tags**: async, interface, types, class, export

### src/session.ts

### Interface: `ISession`

A session authenticated for a user with Nakama server.


  - token: string
    
    The authorization token used to construct this session.
    
  - created: boolean
    
    If the user account for this session was just created.
    
  - created_at: number
    
    The UNIX timestamp when this session was created.
    
  - expires_at?: number
    
    The UNIX timestamp when this session will expire.
    
  - refresh_expires_at?: number
    
    The UNIX timestamp when the refresh token will expire.
    
  - refresh_token: string
    
    Refresh token that can be used for session token renewal.
    
  - username?: string
    
    The username of the user who owns this session.
    
  - user_id?: string
    
    The ID of the user who owns this session.
    
  - vars?: object
    
    Any custom properties associated with this session.
    

### Class: `Session`
  - Property: `token: string`
    
    The authorization token used to construct this session.
    
  - Property: `created_at: number`
    
    The UNIX timestamp when this session was created.
    
  - Property: `expires_at: number`
    
    The UNIX timestamp when this session will expire.
    
  - Property: `refresh_expires_at: number`
    
    The UNIX timestamp when the refresh token will expire.
    
  - Property: `refresh_token: string`
    
    Refresh token that can be used for session token renewal.
    
  - Property: `username: string`
    
    The username of the user who owns this session.
    
  - Property: `user_id: string`
    
    The ID of the user who owns this session.
    
  - Property: `vars: object`
    
    Any custom properties associated with this session.
    
  - Constructor: `constructor(token: string, refresh_token: string, created: boolean): void`
    - Parameter: `token: string`
      
      The authorization token used to construct this session.
      
    - Parameter: `refresh_token: string`
      
      Refresh token that can be used for session token renewal.
      
    - Parameter: `created: boolean`
      
      If the user account for this session was just created.
      
  - Method: `isexpired(currenttime: number): boolean`
    
    If the session has expired.
    
  - Method: `isrefreshexpired(currenttime: number): boolean`
    
    If the refresh token has expired.
    
  - Method: `update(token: string, refreshToken: string): void`
  - Method: `decodeJWT(token: string): void`
  - Method: `restore(token: string, refreshToken: string): Session`


**Tags**: interface, types, class, export

### src/socket.ts

### Interface: `PromiseExecutor`

Stores function references for resolve/reject with a DOM Promise.


  - resolve: (value?: any) => void
  - reject: (reason?: any) => void

### Interface: `Presence`

An object which represents a connected user in the server.


  - user_id: string
    
    The id of the user.
    
  - session_id: string
    
    The session id of the user.
    
  - username: string
    
    The username of the user.
    
  - node: string
    
    The node the user is connected to.
    

### Interface: `Channel`

A response from a channel join operation.


  - id: string
    
    The server-assigned channel id.
    
  - presences: Presence[]
    
    The presences visible on the chat channel.
    
  - self: Presence
    
    The presence of the current user, i.e. yourself.
    

### Interface: `ChannelJoin`

Join a realtime chat channel.


  - channel_join: {
        /** The name of the channel to join. */
        target: string;
        /** The channel type: 1 = Room, 2 = Direct Message, 3 = Group. */
        type: number;
        /** Whether channel messages are persisted in the database. */
        persistence: boolean;
        /** Whether the user's channel presence is hidden when joining. */
        hidden: boolean;
    }

### Interface: `ChannelLeave`

Leave a realtime chat channel.


  - channel_leave: {
        /** The id of the channel to leave. */
        channel_id: string;
    }

### Interface: `ChannelMessage`

An incoming message on a realtime chat channel.


  - channel_id: string
    
    The channel this message belongs to.
    
  - message_id: string
    
    The unique ID of this message.
    
  - code: number
    
    The unique ID of this message.
    
  - sender_id: string
    
    Message sender, usually a user ID.
    
  - username: string
    
    The username of the message sender, if any.
    
  - content: any
    
    The content payload.
    
  - create_time: string
    
    The UNIX time when the message was created.
    
  - update_time: string
    
    The UNIX time when the message was last updated.
    
  - persistent: boolean
    
    True if the message was persisted to the channel's history, false otherwise.
    
  - group_id: string
    
    The ID of the group, or an empty string if this message was not sent through a group channel.
    
  - room_name: string
    
    The name of the chat room, or an empty string if this message was not sent through a chat room.
    
  - user_id_one: string
    
    The ID of the first DM user, or an empty string if this message was not sent through a DM chat.
    
  - user_id_two: string
    
    The ID of the second DM user, or an empty string if this message was not sent through a DM chat.
    

### Interface: `ChannelMessageAck`

An acknowledgement received in response to sending a message on a chat channel.


  - channel_id: string
    
    The server-assigned channel ID.
    
  - message_id: string
    
    A unique ID for the chat message.
    
  - code: number
    
    A user-defined code for the chat message.
    
  - username: string
    
    The username of the sender of the message.
    
  - create_time: string
    
    The UNIX time when the message was created.
    
  - update_time: string
    
    The UNIX time when the message was updated.
    
  - persistence: boolean
    
    True if the chat message has been stored in history.
    

### Interface: `ChannelMessageSend`

Send a message to a realtime chat channel.


  - channel_message_send: {
        /** The server-assigned channel ID. */
        channel_id: string;
        /** The content payload. */
        content: any;
    }

### Interface: `ChannelMessageUpdate`

Update a message previously sent to a realtime chat channel.


  - channel_message_update: {
        /** The server-assigned channel ID. */
        channel_id: string;
        /** A unique ID for the chat message to be updated. */
        message_id: string;
        /** The content payload. */
        content: any;
    }

### Interface: `ChannelMessageRemove`

Remove a message previously sent to a realtime chat channel.


  - channel_message_remove: {
        /** The server-assigned channel ID. */
        channel_id: string;
        /** A unique ID for the chat message to be removed. */
        message_id: string;
    }

### Interface: `ChannelPresenceEvent`

Presence update for a particular realtime chat channel.


  - channel_id: string
    
    The unique identifier of the chat channel.
    
  - joins: Presence[]
    
    Presences of the users who joined the channel.
    
  - leaves: Presence[]
    
    Presences of users who left the channel.
    

### Interface: `StreamId`

Stream identifier


  - mode: number
    
    The type of stream (e.g. chat).
    
  - subject: string
    
    The primary stream subject, usually a user id.
    
  - subcontext: string
    
    A secondary stream subject, for example for a direct chat.
    
  - label: string
    
    Meta-information (e.g. chat room name).
    

### Interface: `StreamData`

Stream data.


  - stream: StreamId
    
    The stream identifier.
    
  - sender?: Presence
    
    A reference to the user presence that sent this data, if any.
    
  - data: string
    
    Arbitrary contents of the data message.
    
  - reliable?: boolean
    
    True if this data was delivered reliably.
    

### Interface: `StreamPresenceEvent`

Presence updates.


  - stream: StreamId
    
    The stream identifier.
    
  - joins: Presence[]
    
    Presences of users who joined the stream.
    
  - leaves: Presence[]
    
    Presences of users who left the stream.
    

### Interface: `MatchPresenceEvent`

Match presence updates.


  - match_id: string
    
    The unique match identifier.
    
  - joins: Presence[]
    
    Presences of users who joined the match.
    
  - leaves: Presence[]
    
    Presences of users who left the match.
    

### Interface: `MatchmakerAdd`

Start a matchmaking process.


  - matchmaker_add: {
        /** The minimum number of opponents for a successful match. */
        min_count: number;
        /** The maximum number of opponents for a successful match. */
        max_count: number;
        /** Criteria for eligible opponents. Use wildcard '*' for any. */
        query: string;
        /** Key-value pairs describing the user (e.g. region). */
        string_properties?: Record<string, string>;
        /** Key-value pairs describing the user (e.g. rank). */
        numeric_properties?: Record<string, number>;
    }

### Interface: `MatchmakerTicket`

The matchmaker ticket received from the server.


  - ticket: string
    
    The ticket generated by the matchmaker.
    

### Interface: `MatchmakerRemove`

Cancel a matchmaking process.


  - matchmaker_remove: {
        /** The matchmaker ticket to be removed. */
        ticket: string;
    }

### Interface: `MatchmakerUser`

A reference to a user and their matchmaking properties.


  - presence: Presence
    
    User information for the user being matched.
    
  - party_id: string
    
    Party identifier, if this user was matched as a party member.
    
  - string_properties?: Record<string, string>
    
    String properties describing the user.
    
  - numeric_properties?: Record<string, number>
    
    Numeric properties describing the user.
    

### Interface: `MatchmakerMatched`

The result of a successful matchmaker operation sent to the server.


  - ticket: string
    
    The ticket sent by the server when the user requested to matchmake for other players.
    
  - match_id: string
    
    A match ID used to join the match.
    
  - token: string
    
    The token used to join a match.
    
  - users: MatchmakerUser[]
    
    The other users matched with this user and the parameters they sent.
    
  - self: MatchmakerUser
    
    The current user who matched with opponents.
    

### Interface: `Match`

A realtime multiplayer match.


  - match_id: string
    
    The unique match identifier.
    
  - authoritative: boolean
    
    If this match has an authoritative handler on the server.
    
  - label?: string
    
    A label for the match which can be filtered on.
    
  - size: number
    
    The number of users currently in the match.
    
  - presences: Presence[]
    
    The presences already in the match.
    
  - self: Presence
    
    The current user in this match, i.e. yourself.
    

### Interface: `CreateMatch`

Create a multiplayer match.


  - match_create: {
        name?: string;
    }

### Interface: `JoinMatch`

Join a multiplayer match.


  - match_join: {
        /** The unique identifier of the match to join. */
        match_id?: string;
        /** The token used to join the match. */
        token?: string;
        /** An optional set of key-value metadata pairs to be passed to the match handler. */
        metadata?: {};
    }

### Interface: `LeaveMatch`

Leave a multiplayer match.


  - match_leave: {
        /** The unique identifier of the match to leave. */
        match_id: string;
    }

### Interface: `MatchData`

Match data


  - match_id: string
    
    The unique match identifier.
    
  - op_code: number
    
    Operation code value.
    
  - data: Uint8Array
    
    Data payload, if any.
    
  - presence?: Presence
    
    A reference to the user presence that sent this data, if any.
    
  - reliable?: boolean
    
    True if this data was delivered reliably.
    

### Interface: `MatchDataSend`

Send a message that contains match data.


  - match_data_send: {
        /** The unique match identifier. */
        match_id: string;
        /** Operation code value. */
        op_code: number;
        /** Data payload, if any. */
        data: string | Uint8Array;
        /** A reference to the user presences to send this data to, if any. */
        presences: Presence[];
        /** True if the data should be sent reliably. */
        reliable?: boolean;
    }

### Interface: `Party`

Incoming information about a party.


  - party_id: string
    
    The unique party identifier.
    
  - open: boolean
    
    True, if the party is open to join.
    
  - max_size: number
    
    The maximum number of party members.
    
  - self: Presence
    
    The current user in this party, i.e. yourself.
    
  - leader: Presence
    
    The current party leader.
    
  - presences: Presence[]
    
    All members currently in the party.
    

### Interface: `PartyCreate`

Create a party.


  - party_create: {
        /** True, if the party is open to join. */
        open: boolean;
        /** The maximum number of party members. */
        max_size: number;
    }

### Interface: `PartyJoin`

Join a party.


  - party_join: {
        /** The unique party identifier. */
        party_id: string;
    }

### Interface: `PartyLeave`

Leave a party.


  - party_leave: {
        /** The unique party identifier. */
        party_id: string;
    }

### Interface: `PartyPromote`

Promote a new party leader.


  - party_promote: {
        /** The unique party identifier. */
        party_id: string;
        /** The user presence being promoted to leader. */
        presence: Presence;
    }

### Interface: `PartyLeader`

Announcement of a new party leader.


  - party_id: string
    
    The unique party identifier.
    
  - presence: Presence
    
    The presence of the new party leader.
    

### Interface: `PartyAccept`

Accept a request to join.


  - party_accept: {
        /** The unique party identifier. */
        party_id: string;
        /** The presence being accepted to join the party. */
        presence: Presence;
    }

### Interface: `PartyClose`

End a party, kicking all party members and closing it.


  - party_close: {
        /** The unique party identifier. */
        party_id: string;
    }

### Interface: `PartyData`

Incoming party data delivered from the server.


  - party_id: string
    
    The unique party identifier.
    
  - presence: Presence
    
    A reference to the user presence that sent this data, if any.
    
  - op_code: number
    
    The operation code the message was sent with.
    
  - data: Uint8Array
    
    Data payload, if any.
    

### Interface: `PartyDataSend`

A client to server request to send data to a party.


  - party_data_send: {
        /** The unique party identifier. */
        party_id: string;
        /** The operation code the message was sent with. */
        op_code: number;
        /** Data payload, if any. */
        data: string | Uint8Array;
    }

### Interface: `PartyJoinRequest`

Incoming notification for one or more new presences attempting to join the party.


  - party_id: string
    
    The ID of the party to get a list of join requests for.
    
  - presences: Presence[]
    
    Presences attempting to join, or who have joined.
    

### Interface: `PartyJoinRequestList`

Request a list of pending join requests for a party.


  - party_join_request_list: {
        /** The ID of the party to get a list of join requests for. */
        party_id: string;
    }

### Interface: `PartyMatchmakerAdd`

Begin matchmaking as a party.


  - party_matchmaker_add: {
        /** The ID of the party to create a matchmaker ticket for. */
        party_id: string;
        /** Minimum total user count to match together. */
        min_count: number;
        /** Maximum total user count to match together. */
        max_count: number;
        /** Filter query used to identify suitable users. */
        query: string;
        /** String properties describing the party (e.g. region). */
        string_properties?: Record<string, string>;
        /** Numeric properties describing the party (e.g. rank). */
        numeric_properties?: Record<string, number>;
    }

### Interface: `PartyMatchmakerRemove`

Cancel a party matchmaking process using a ticket.


  - party_matchmaker_remove: {
        /** The ID of the party to cancel a matchmaker ticket for. */
        party_id: string;
        /** The ticket to remove. */
        ticket: string;
    }

### Interface: `PartyMatchmakerTicket`

A response from starting a new party matchmaking process.


  - party_id: string
    
    The ID of the party.
    
  - ticket: string
    
    The matchmaker ticket created.
    

### Interface: `PartyPresenceEvent`

Presence update for a particular party.


  - party_id: string
    
    The ID of the party.
    
  - joins: Presence[]
    
    The user presences that have just joined the party.
    
  - leaves: Presence[]
    
    The user presences that have just left the party.
    

### Interface: `PartyRemove`

Kick a party member, or decline a request to join.


  - party_remove: {
        /** The ID of the party to remove/reject from. */
        party_id: string;
        /** The presence to remove/reject. */
        presence: Presence;
    }

### Interface: `Rpc`

Execute an Lua function on the server.


  - rpc: ApiRpc

### Interface: `Ping`

Application-level heartbeat ping.



### Interface: `Status`

A snapshot of statuses for some set of users.


  - presences: Presence[]
    
    The user presences to view statuses of.
    

### Interface: `StatusFollow`

Start receiving status updates for some set of users.


  - status_follow: { user_ids: string[] }
    
    The IDs of the users to follow.
    

### Interface: `StatusPresenceEvent`

A batch of status updates for a given user.


  - joins: Presence[]
    
    This join information is in response to a subscription made to be notified when a user comes online.
    
  - leaves: Presence[]
    
    This join information is in response to a subscription made to be notified when a user goes offline.
    

### Interface: `StatusUnfollow`

Stop receiving status updates for some set of users.


  - status_unfollow: { user_ids: string[] }
    
    The IDs of user to unfollow.
    

### Interface: `StatusUpdate`

Set the user's own status.


  - status_update: { status?: string }
    
    Status string to set, if not present the user will appear offline.
    

### Interface: `Socket`

A socket connection to Nakama server.


  - ondisconnect: (evt: Event) => void
    
    Handle disconnect events received from the socket.
    
  - onerror: (evt: Event) => void
    
    Handle error events received from the socket.
    
  - onnotification: (notification: Notification) => void
    
    Receive notifications from the socket.
    
  - onmatchdata: (matchData: MatchData) => void
    
    Receive match data updates.
    
  - onmatchpresence: (matchPresence: MatchPresenceEvent) => void
    
    Receive match presence updates.
    
  - onmatchmakerticket: (matchmakerTicket: MatchmakerTicket) => void
    
    Receive a matchmaker ticket.
    
  - onmatchmakermatched: (matchmakerMatched: MatchmakerMatched) => void
    
    Receive matchmaking results.
    
  - onparty: (party: Party) => void
    
    Receive party events.
    
  - onpartyclose: (partyClose: PartyClose) => void
    
    Receive party close events.
    
  - onpartydata: (partyData: PartyData) => void
    
    Receive party data updates.
    
  - onpartyjoinrequest: (partyJoinRequest: PartyJoinRequest) => void
    
    Receive party join requests, if party leader.
    
  - onpartyleader: (partyLeader: PartyLeader) => void
    
    Receive announcements of a new party leader.
    
  - onpartypresence: (partyPresence: PartyPresenceEvent) => void
    
    Receive a presence update for a party.
    
  - onpartymatchmakerticket: (
        partyMatchmakerMatched: PartyMatchmakerTicket
    ) => void
    
    Receive matchmaking results.
    
  - onstatuspresence: (statusPresence: StatusPresenceEvent) => void
    
    Receive status presence updates.
    
  - onstreampresence: (streamPresence: StreamPresenceEvent) => void
    
    Receive stream presence updates.
    
  - onstreamdata: (streamData: StreamData) => void
    
    Receive stream data.
    
  - onheartbeattimeout: () => void
    
    An application-level heartbeat timeout that fires after the client does not receive a pong from the server after the heartbeat interval.
    Most browsers maintain an internal heartbeat, in which case its unlikely you'll need to use this callback. However, Chrome does not implement an internal heartbeat.
    We fire this separately from `onclose` because heartbeats fail when there's no connectivity, and many browsers don't fire `onclose` until the closing handshake either succeeds or fails.
    In any case, be aware that `onclose` will still fire if there is a heartbeat timeout in a potentially delayed manner.
    
  - onchannelmessage: (channelMessage: ChannelMessage) => void
    
    Receive channel message.
    
  - onchannelpresence: (channelPresence: ChannelPresenceEvent) => void
    
    Receive channel presence updates.
    

### Interface: `SocketError`

Reports an error received from a socket message.


  - code: number
    
    The error code.
    
  - message: string
    
    A message in English to help developers debug the response.
    

### Class: `DefaultSocket`

A socket connection to Nakama server implemented with the DOM's WebSocket API.


  - Property: `DefaultHeartbeatTimeoutMs: any`
  - Property: `DefaultSendTimeoutMs: any`
  - Property: `DefaultConnectTimeoutMs: any`
  - Property: `cIds: { [key: string]: PromiseExecutor }`
  - Property: `nextCid: number`
  - Property: `_heartbeatTimeoutMs: number`
  - Constructor: `constructor(host: string, port: string, useSSL: boolean, verbose: boolean, adapter: WebSocketAdapter, sendTimeoutMs: number): void`
    - Parameter: `host: string`
    - Parameter: `port: string`
    - Parameter: `useSSL: boolean`
    - Parameter: `verbose: boolean`
    - Parameter: `adapter: WebSocketAdapter`
    - Parameter: `sendTimeoutMs: number`
  - Method: `generatecid(): string`
  - Method: `connect(session: Session, createStatus: boolean, connectTimeoutMs: number): Promise<Session>`
    
    Connect to the server.
    
  - Method: `disconnect(fireDisconnectEvent: boolean): void`
    
    Disconnect from the server.
    
  - Method: `setHeartbeatTimeoutMs(ms: number): void`
  - Method: `getHeartbeatTimeoutMs(): number`
  - Method: `ondisconnect(evt: Event): void`
    
    Handle disconnect events received from the socket.
    
  - Method: `onerror(evt: Event): void`
    
    Handle error events received from the socket.
    
  - Method: `onchannelmessage(channelMessage: ChannelMessage): void`
    
    Receive channel message.
    
  - Method: `onchannelpresence(channelPresence: ChannelPresenceEvent): void`
    
    Receive channel presence updates.
    
  - Method: `onnotification(notification: Notification): void`
    
    Receive notifications from the socket.
    
  - Method: `onmatchdata(matchData: MatchData): void`
    
    Receive match data updates.
    
  - Method: `onmatchpresence(matchPresence: MatchPresenceEvent): void`
    
    Receive match presence updates.
    
  - Method: `onmatchmakerticket(matchmakerTicket: MatchmakerTicket): void`
    
    Receive a matchmaker ticket.
    
  - Method: `onmatchmakermatched(matchmakerMatched: MatchmakerMatched): void`
    
    Receive matchmaking results.
    
  - Method: `onparty(party: Party): void`
    
    Receive party events.
    
  - Method: `onpartyclose(close: PartyClose): void`
    
    Receive party close events.
    
  - Method: `onpartyjoinrequest(partyJoinRequest: PartyJoinRequest): void`
    
    Receive party join requests, if party leader.
    
  - Method: `onpartydata(partyData: PartyData): void`
    
    Receive party data updates.
    
  - Method: `onpartyleader(partyLeader: PartyLeader): void`
    
    Receive announcements of a new party leader.
    
  - Method: `onpartymatchmakerticket(partyMatched: PartyMatchmakerTicket): void`
    
    Receive matchmaking results.
    
  - Method: `onpartypresence(partyPresence: PartyPresenceEvent): void`
    
    Receive a presence update for a party.
    
  - Method: `onstatuspresence(statusPresence: StatusPresenceEvent): void`
    
    Receive status presence updates.
    
  - Method: `onstreampresence(streamPresence: StreamPresenceEvent): void`
    
    Receive stream presence updates.
    
  - Method: `onstreamdata(streamData: StreamData): void`
    
    Receive stream data.
    
  - Method: `onheartbeattimeout(): void`
    
    An application-level heartbeat timeout that fires after the client does not receive a pong from the server after the heartbeat interval.
    Most browsers maintain an internal heartbeat, in which case its unlikely you'll need to use this callback. However, Chrome does not implement an internal heartbeat.
    We fire this separately from `onclose` because heartbeats fail when there's no connectivity, and many browsers don't fire `onclose` until the closing handshake either succeeds or fails.
    In any case, be aware that `onclose` will still fire if there is a heartbeat timeout in a potentially delayed manner.
    
  - Method: `send(message: | ChannelJoin
            | ChannelLeave
            | ChannelMessageSend
            | ChannelMessageUpdate
            | ChannelMessageRemove
            | CreateMatch
            | JoinMatch
            | LeaveMatch
            | MatchDataSend
            | MatchmakerAdd
            | MatchmakerRemove
            | PartyAccept
            | PartyClose
            | PartyCreate
            | PartyDataSend
            | PartyJoin
            | PartyJoinRequestList
            | PartyLeave
            | PartyMatchmakerAdd
            | PartyMatchmakerRemove
            | PartyPromote
            | PartyRemove
            | Rpc
            | StatusFollow
            | StatusUnfollow
            | StatusUpdate
            | Ping, sendTimeout: any): Promise<any>`
  - Method: `acceptPartyMember(party_id: string, presence: Presence): Promise<void>`
    
    Accept a request to join.
    
  - Method: `addMatchmaker(query: string, min_count: number, max_count: number, string_properties?: Record<string, string>, numeric_properties?: Record<string, number>): Promise<MatchmakerTicket>`
    
    Join the matchmaker pool and search for opponents on the server.
    
  - Method: `addMatchmakerParty(party_id: string, query: string, min_count: number, max_count: number, string_properties?: Record<string, string>, numeric_properties?: Record<string, number>): Promise<PartyMatchmakerTicket>`
    
    Begin matchmaking as a party.
    
  - Method: `closeParty(party_id: string): Promise<void>`
    
    End a party, kicking all party members and closing it.
    
  - Method: `createMatch(name?: string): Promise<Match>`
    
    Create a multiplayer match on the server.
    
  - Method: `createParty(open: boolean, max_size: number): Promise<Party>`
    
    Create a party.
    
  - Method: `followUsers(userIds: string[]): Promise<Status>`
    
    Subscribe to one or more users for their status updates.
    
  - Method: `joinChat(target: string, type: number, persistence: boolean, hidden: boolean): Promise<Channel>`
    
    Join a chat channel on the server.
    
  - Method: `joinMatch(match_id?: string, token?: string, metadata?: {}): Promise<Match>`
    
    Join a multiplayer match.
    
  - Method: `joinParty(party_id: string): Promise<void>`
    
    Join a party.
    
  - Method: `leaveChat(channel_id: string): Promise<void>`
    
    Leave a chat channel on the server.
    
  - Method: `leaveMatch(matchId: string): Promise<void>`
    
    Leave a multiplayer match on the server.
    
  - Method: `leaveParty(party_id: string): Promise<void>`
    
    Leave a party.
    
  - Method: `listPartyJoinRequests(party_id: string): Promise<PartyJoinRequest>`
    
    Request a list of pending join requests for a party.
    
  - Method: `promotePartyMember(party_id: string, party_member: Presence): Promise<PartyLeader>`
    
    Promote a new party leader.
    
  - Method: `removeChatMessage(channel_id: string, message_id: string): Promise<ChannelMessageAck>`
    
    Remove a chat message from a chat channel on the server.
    
  - Method: `removeMatchmaker(ticket: string): Promise<void>`
    
    Leave the matchmaker pool with the provided ticket.
    
  - Method: `removeMatchmakerParty(party_id: string, ticket: string): Promise<void>`
    
    Cancel a party matchmaking process using a ticket.
    
  - Method: `removePartyMember(party_id: string, member: Presence): Promise<void>`
    
    Kick a party member, or decline a request to join.
    
  - Method: `rpc(id?: string, payload?: string, http_key?: string): Promise<ApiRpc>`
    
    Execute an RPC function to the server.
    
  - Method: `sendMatchState(matchId: string, opCode: number, data: string | Uint8Array, presences?: Presence[], reliable?: boolean): Promise<void>`
    
    When no presences are supplied the new match state will be sent to all presences.
    
  - Method: `sendPartyData(party_id: string, op_code: number, data: string | Uint8Array): Promise<void>`
    
    Send data to a party.
    
  - Method: `unfollowUsers(user_ids: string[]): Promise<void>`
    
    Unfollow one or more users from their status updates.
    
  - Method: `updateChatMessage(channel_id: string, message_id: string, content: any): Promise<ChannelMessageAck>`
    
    Update a chat message on a chat channel in the server.
    
  - Method: `updateStatus(status?: string): Promise<void>`
    
    Update the status for the current user online.
    
  - Method: `writeChatMessage(channel_id: string, content: any): Promise<ChannelMessageAck>`
    
    Send a chat message to a chat channel on the server.
    
  - Method: `pingPong(): Promise<void>`


**Tags**: async, interface, types, class, function, export

### src/web_socket_adapter.ts

### Interface: `WebSocketAdapter`

An interface used by Nakama's web socket to determine the payload protocol.


  - onClose: SocketCloseHandler | null
    
    Dispatched when the web socket closes.
    
  - onError: SocketErrorHandler | null
    
    Dispatched when the web socket receives an error.
    
  - onMessage: SocketMessageHandler | null
    
    Dispatched when the web socket receives a normal message.
    
  - onOpen: SocketOpenHandler | null
    
    Dispatched when the web socket opens.
    

### Interface: `SocketCloseHandler`

SocketCloseHandler defines a lambda that handles WebSocket close events.



### Interface: `SocketErrorHandler`

SocketErrorHandler defines a lambda that handles responses from the server via WebSocket
that indicate an error.



### Interface: `SocketMessageHandler`

SocketMessageHandler defines a lambda that handles valid WebSocket messages.



### Interface: `SocketOpenHandler`

SocketOpenHandler defines a lambda that handles WebSocket open events.



### Class: `WebSocketAdapterText`

A text-based socket adapter that accepts and transmits payloads over UTF-8.


  - Property: `_socket: WebSocket`
  - Method: `isOpen(): boolean`
  - Method: `connect(scheme: string, host: string, port: string, createStatus: boolean, token: string): void`
  - Method: `close(): void`
  - Method: `send(msg: any): void`


**Tags**: interface, types, class, export

## Module

### src/index.ts

**Tags**: export

### src/tokens.ts

**Tags**: export

### tsup.config.ts

**Tags**: export

## Types

### src/types.ts

### Interface: `Notification`

A notification in the server.


  - code?: number
    
    Category code for this notification.
    
  - content?: {}
    
    Content of the notification in JSON.
    
  - create_time?: string
    
    The UNIX time when the notification was created.
    
  - id?: string
    
    ID of the Notification.
    
  - persistent?: boolean
    
    True if this notification was persisted to the database.
    
  - sender_id?: string
    
    ID of the sender, if a user. Otherwise 'null'.
    
  - subject?: string
    
    Subject of the notification.
    


**Tags**: interface, types, export

## Utility

### src/utils.ts

### Function: `buildFetchOptions(method: string, options: any, bodyJson: string): void`
### Function: `b64EncodeUnicode(str: string): void`
### Function: `b64DecodeUnicode(str: string): void`

**Tags**: function, export

