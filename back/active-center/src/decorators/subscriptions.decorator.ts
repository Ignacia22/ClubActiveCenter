import { SetMetadata } from "@nestjs/common";
import { Subscriptions } from "src/Subscription/SubscriptionDTO/Subscription.enum";

export const subscriptions = (...sub: Subscriptions[]) => SetMetadata('subscriptions', sub)