import { useState, useEffect, useCallback, useMemo } from "react";
import { AppLayout } from "@/layouts/AppLayout"
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { LaundryCalculator } from "@/components/laundry-pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { PricingCategory } from "@/components/laundry-pricing";
import {
  User,
  Bell,
  Building2,
  Lock,
  Save,
  Check,
  Shield,
  Tag,
  LayoutDashboard,
  ShoppingCart,
  Users as UsersIcon,
  Palette,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import { usePage, useForm } from '@inertiajs/react';

export default function SettingsPage() {
  // const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [activeTab, setActiveTab] = useState("profile");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [pricingData, setPricingData] = useState({
    bulk: {
      perLoad: { label: "Per Load (8Kg)", price: 1000, unit: "load" },
      washDryFold: { label: "Wash, Dry, Fold", price: 150, unit: "Kg" },
    },
    clothing: {
      blazer: { label: "Blazer", price: 400, unit: "piece" },
      jacket: { label: "Jacket / Trench Coat", price: 400, unit: "piece" },
      gown: { label: "Graduation Gown", price: 1000, unit: "piece" },
      suit: { label: "Suit (Blazer & Trouser)", price: 500, unit: "piece" },
      socks: { label: "Socks", price: 100, unit: "pair" },
      shirt: { label: "Shirt / Blouse", price: 150, unit: "piece" },
      trouser: { label: "Official Trouser", price: 200, unit: "piece" },
    },
    beddings: {
      duvetSmall: { label: "Duvet 4x6 / Kids", price: 500, unit: "each" },
      duvetLarge: { label: "Duvet 6x6 / 5x6", price: 1000, unit: "each" },
      throwBlanket: { label: "Throw Blanket", price: 400, unit: "each" },
      normalBlanket: { label: "Normal Blanket", price: 600, unit: "each" },
      bedsheets: { label: "Bedsheets", price: 300, unit: "piece" },
      smallTowel: { label: "Small Towel", price: 200, unit: "piece" },
      largeTowel: { label: "Large Towel", price: 300, unit: "piece" },
      pillows: { label: "Pillows", price: 300, unit: "piece" },
      mattressCover: { label: "Mattress Cover", price: 300, unit: "piece" },
    },
    personal: {
      underwear: {
        label: "Bras / Panties / Boxers",
        price: 200,
        unit: "piece",
      },
    },
    household: {
      sheers: { label: "Sheers (per unit of 2)", price: 200, unit: "unit" },
      curtains: { label: "Curtains", price: 300, unit: "Kg" },
      teddySmall: { label: "Teddy Bear (Small)", price: 300, unit: "each" },
      teddyBig: { label: "Teddy Bear (Big)", price: 400, unit: "each" },
    },
    extras: {
      largeBag: { label: "Laundry Bag (Large)", price: 100, unit: "bag" },
      mediumBag: { label: "Laundry Bag (Medium)", price: 50, unit: "bag" },
    },
  });

  const handlePriceChange = useCallback(
    (category: PricingCategory, item: string, newPrice: number) => {
      setPricingData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [item]: { ...(prev[category] as any)[item], price: newPrice },
        },
      }));
    },
    []
  );

  // Profile settings state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    gender: "male",
  });

  // Business settings state
  const [businessData, setBusinessData] = useState({
    businessName: "LaundroHub",
    businessPhone: "+1 (555) 123-4567",
    businessEmail: "info@laundrohub.com",
    address: "123 Main Street, City, State 12345",
    operatingHours: "Mon-Sun: 6:00 AM - 10:00 PM",
    currency: "USD",
    taxRate: "8.5",
  });

  // Notification settings state
  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    smsNotifications: true,
    orderUpdates: true,
    paymentAlerts: true,
    staffAlerts: true,
    dailyReport: true,
  });

  // Security settings state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveProfile = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSaveBusiness = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSaveNotifications = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSavePricing = () => {
    fetch("/api/pricing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pricingData),
    })
      .then((response) => {
        if (response.ok) {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        } else {
          alert("Failed to save pricing. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error saving pricing:", error);
      });
  };

  const handleChangePassword = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setSaveSuccess(true);
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // const rolesPermissions = {
  //   admin: {
  //     dashboard: { view: true },
  //     orders: { create: true, read: true, update: true, delete: true },
  //     customers: { create: true, read: true, update: true, delete: true },
  //     staff: { create: true, read: true, update: true, delete: true },
  //     payments: { read: true, "process-refunds": true },
  //     reports: { read: true },
  //     settings: {
  //       "manage-business": true,
  //       "manage-pricing": true,
  //       "manage-roles": true,
  //     },
  //   },
  //   manager: {
  //     dashboard: { view: true },
  //     orders: { create: true, read: true, update: true, delete: false },
  //     customers: { create: true, read: true, update: true, delete: false },
  //     staff: { create: true, read: true, update: true, delete: false },
  //     payments: { read: true, "process-refunds": true },
  //     reports: { read: true },
  //     settings: {
  //       "manage-business": true,
  //       "manage-pricing": true,
  //       "manage-roles": false,
  //     },
  //   },
  //   staff: {
  //     dashboard: { view: true },
  //     orders: { create: true, read: true, update: true, delete: false },
  //     customers: { create: true, read: true, update: false, delete: false },
  //     staff: { create: false, read: false, update: false, delete: false },
  //     payments: { read: false, "process-refunds": false },
  //     reports: { read: false },
  //     settings: {
  //       "manage-business": false,
  //       "manage-pricing": false,
  //       "manage-roles": false,
  //     },
  //   },
  // };

  // const [permissions, setPermissions] = useState(rolesPermissions);

  // const handlePermissionChange = (
  //   role: keyof typeof permissions,
  //   category: string,
  //   permission: string,
  //   value: boolean
  // ) => {
  //   setPermissions((prev) => ({
  //     ...prev,
  //     [role]: {
  //       ...prev[role],
  //       [category]: {
  //         // @ts-ignore
  //         ...prev[role][category],
  //         [permission]: value,
  //       },
  //     },
  //   }));
  // };

  // const permissionCategories = [
  //   {
  //     key: "dashboard",
  //     title: "Dashboard",
  //     icon: LayoutDashboard,
  //     permissions: [{ key: "view", label: "View Dashboard" }],
  //   },
  //   {
  //     key: "orders",
  //     title: "Order Management",
  //     icon: ShoppingCart,
  //     permissions: [
  //       { key: "create", label: "Create Orders" },
  //       { key: "read", label: "View All Orders" },
  //       { key: "update", label: "Update Order Status" },
  //       { key: "delete", label: "Delete Orders" },
  //     ],
  //   },
  //   {
  //     key: "customers",
  //     title: "Customer Management",
  //     icon: UsersIcon,
  //     permissions: [
  //       { key: "create", label: "Add New Customers" },
  //       { key: "read", label: "View Customer Details" },
  //       { key: "update", label: "Edit Customer Information" },
  //       { key: "delete", label: "Delete Customers" },
  //     ],
  //   },
  //   // Add other categories here...
  // ];

  // const { roles, allPermissions } = usePage<PageProps>().props;

  // // Group all permissions *once* and pass to children
  // const groupedPermissions = useMemo(
  //   () => groupPermissions(allPermissions),
  //   [allPermissions]
  // );

  // Set default tab to the first role, or a fallback
  // const defaultRole = roles.length > 0 ? roles[0].name.toLowerCase() : 'admin';

  return (
    <AppLayout>
      <DashboardLayout>
        <div className="w-full space-y-4 sm:space-y-6 px-4 sm:px-0">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Settings
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Manage your account and system preferences
            </p>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex items-center gap-2 text-sm sm:text-base">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-green-600" />
              <p className="text-green-700">Settings saved successfully!</p>
            </div>
          )}

          {/* Settings Tabs */}
          <Card className="p-3 sm:p-4 md:p-6 w-full overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 gap-1 sm:gap-0 mb-4 sm:mb-6">
                <TabsTrigger
                  value="profile"
                  className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value="business"
                  className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Business</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Notify</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger
                  value="roles"
                  className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Roles</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Pricing</span>
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Appearance</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent
                value="profile"
                className="mt-4 sm:mt-6 space-y-3 sm:space-y-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={profileData.avatar}
                      alt={profileData.name}
                    />
                    <AvatarFallback>
                      {profileData.gender === "female" ? (
                        <UserIcon className="h-10 w-10" /> // Replace with a female icon if you have one
                      ) : (
                        <UserIcon className="h-10 w-10" /> // Default/male icon
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Upload new picture
                    </label>
                    <input id="avatar-upload" type="file" className="hidden" />
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="pt-2 sm:pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Save Profile
                  </Button>
                </div>
              </TabsContent>

              {/* Business Tab */}
              <TabsContent
                value="business"
                className="mt-4 sm:mt-6 space-y-3 sm:space-y-4"
              >
                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessData.businessName}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        businessName: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your business name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                      Business Phone
                    </label>
                    <input
                      type="tel"
                      value={businessData.businessPhone}
                      onChange={(e) =>
                        setBusinessData({
                          ...businessData,
                          businessPhone: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={businessData.businessEmail}
                      onChange={(e) =>
                        setBusinessData({
                          ...businessData,
                          businessEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="business@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={businessData.address}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="123 Main Street, City, State 12345"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={businessData.operatingHours}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        operatingHours: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Mon-Sun: 6:00 AM - 10:00 PM"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                      Currency
                    </label>
                    <select
                      value={businessData.currency}
                      onChange={(e) =>
                        setBusinessData({
                          ...businessData,
                          currency: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="KES">KES (Ksh)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={businessData.taxRate}
                      onChange={(e) =>
                        setBusinessData({
                          ...businessData,
                          taxRate: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="8.5"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <Button
                    onClick={handleSaveBusiness}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Save Business Settings
                  </Button>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent
                value="notifications"
                className="mt-4 sm:mt-6 space-y-2 sm:space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-4 border border-border rounded-lg gap-3 sm:gap-0">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-medium text-foreground">
                      Email Notifications
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationData.emailNotifications}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-border shrink-0"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-4 border border-border rounded-lg gap-3 sm:gap-0">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-medium text-foreground">
                      SMS Notifications
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Receive updates via SMS
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationData.smsNotifications}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        smsNotifications: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-border shrink-0"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-4 border border-border rounded-lg gap-3 sm:gap-0">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-medium text-foreground">
                      Order Updates
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Get notified about order status changes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationData.orderUpdates}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        orderUpdates: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-border shrink-0"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-4 border border-border rounded-lg gap-3 sm:gap-0">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-medium text-foreground">
                      Payment Alerts
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Get notified about payment transactions
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationData.paymentAlerts}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        paymentAlerts: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-border shrink-0"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-4 border border-border rounded-lg gap-3 sm:gap-0">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-medium text-foreground">
                      Staff Alerts
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Get notified about staff activities
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationData.staffAlerts}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        staffAlerts: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-border shrink-0"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-4 border border-border rounded-lg gap-3 sm:gap-0">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-medium text-foreground">
                      Daily Report
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Receive daily business summary
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationData.dailyReport}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        dailyReport: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-border shrink-0"
                  />
                </div>

                <div className="pt-2 sm:pt-4">
                  <Button
                    onClick={handleSaveNotifications}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Save Notification Settings
                  </Button>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent
                value="security"
                className="mt-4 sm:mt-6 space-y-3 sm:space-y-4"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-4 mb-2 sm:mb-4">
                  <p className="text-xs sm:text-sm text-blue-700">
                    Keep your account secure by using a strong password. Change
                    your password regularly.
                  </p>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your current password"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your new password"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-1.5 sm:mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Confirm your new password"
                  />
                </div>

                <div className="pt-2 sm:pt-4">
                  <Button
                    onClick={handleChangePassword}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Change Password
                  </Button>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">
                    Active Sessions
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-4 border border-border rounded-lg gap-2 sm:gap-0">
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-medium text-foreground">
                          Current Session
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Chrome on Windows
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded w-fit">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Roles & Permissions Tab */}
              {/* <TabsContent
              value="roles"
              className="mt-4 sm:mt-6 space-y-3 sm:space-y-4"
            >
              <Tabs defaultValue="manager" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                  <TabsTrigger value="manager">Manager</TabsTrigger>
                  <TabsTrigger value="staff">Staff</TabsTrigger>
                </TabsList>
                {(
                  Object.keys(permissions) as Array<keyof typeof permissions>
                ).map((role) => (
                  <TabsContent key={role} value={role} className="mt-6">
                    <div className="space-y-6">
                      {permissionCategories.map((category) => (
                        <Card key={category.key}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                              <category.icon className="w-5 h-5 text-primary" />
                              {category.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {category.permissions.map((perm) => (
                              <div
                                key={perm.key}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <Label
                                  htmlFor={`${role}-${category.key}-${perm.key}`}
                                  className="text-sm font-normal"
                                >
                                  {perm.label}
                                </Label>
                                <Switch
                                  id={`${role}-${category.key}-${perm.key}`}
                                  checked={
                                    (permissions[role] as any)[category.key]?.[
                                      perm.key
                                    ] ?? false
                                  }
                                  onCheckedChange={(value: any) =>
                                    handlePermissionChange(
                                      role,
                                      category.key,
                                      perm.key,
                                      value
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ))}
                      <div className="pt-2">
                        <Button
                          onClick={() => {
                            setSaveSuccess(true);
                            setTimeout(() => setSaveSuccess(false), 2000);
                          }}
                          className="w-full sm:w-auto"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save {role.charAt(0).toUpperCase() +
                            role.slice(1)}{" "}
                          Permissions
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent> */}
              {/* <TabsContent
                value="roles" // This assumes this component is inside another <Tabs>
                className="mt-4 sm:mt-6 space-y-3 sm:space-y-4"
              >
                <Tabs defaultValue={defaultRole} className="w-full">
                  <TabsList className={`grid w-full grid-cols-${roles.length}`}>
                    {roles.map((role) => (
                      <TabsTrigger
                        key={role.id}
                        value={role.name.toLowerCase()} 
                      >
                        {role.name} 
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  
                  {roles.map((role) => (
                    <TabsContent
                      key={role.id}
                      value={role.name.toLowerCase()}
                      className="mt-6"
                    >
                      <RolePermissionForm
                        role={role}
                        groupedPermissions={groupedPermissions}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent> */}

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="mt-4 sm:mt-6 space-y-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                    Pricing Structure
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our system calculates charges based on whether an item is
                    priced per piece or by weight (per Kg).
                  </p>
                </div>

                <LaundryCalculator
                  isEditable={true}
                  pricingData={pricingData}
                  onPriceChange={handlePriceChange}
                />

                <div className="pt-2 sm:pt-4">
                  <Button
                    onClick={handleSavePricing}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Save Pricing
                  </Button>
                </div>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="mt-4 sm:mt-6 space-y-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                    Appearance
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Customize the look and feel of the application.
                  </p>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Theme</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Label htmlFor="theme">Select Theme</Label>
                      {mounted ? (
                        <select
                          id="theme"
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="system">System</option>
                          <option value="dark">Dark</option>
                          <option value="light">Light</option>
                        </select>
                      ) : (
                        <div className="w-full h-10 rounded-lg bg-muted animate-pulse" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </DashboardLayout>
    </AppLayout>
  );
}
