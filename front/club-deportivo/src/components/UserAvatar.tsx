// "use client";


// import Link from "next/link";
// import Swal from "sweetalert2";
// import { useState } from "react";
// import Image from "next/image";
// import { getAvatars } from "@/helpers/avatares";

// export default function UserAvatar() {
//   //const { isAuthenticated, user, logout } = useAuth();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "/default-avatar.png");

//   const salir = () => {
//     Swal.fire({
//       title: "¿Estás seguro de cerrar sesión?",
//       text: "Tu sesión se cerrará y tendrás que iniciar nuevamente para acceder.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Sí, cerrar sesión",
//       cancelButtonText: "Cancelar",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire({
//           title: "Sesión cerrada",
//           text: "Tu sesión ha sido cerrada con éxito.",
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//         //logout();
//       }
//     });
//   };

//   const avatars = getAvatars(); 

//   const handleAvatarChange = (avatar: string) => {
//     setSelectedAvatar(avatar);
//     setIsModalOpen(false);

//   };

//   return isAuthenticated ? (
//     <div className="relative">
//       <div className="flex items-center gap-4">
//         <Image
//           src={selectedAvatar}
//           alt="User Avatar"
//           className="w-12 h-12 rounded-full cursor-pointer"
//           onClick={() => setIsModalOpen(true)}
//         />
//         <p>Hi, {user?.name}!</p>
//         <button className="p-2 bg-black text-white" onClick={salir}>
//           LOG OUT
//         </button>
//       </div>

//       {/* Modal para elegir el avatar */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-lg font-semibold mb-4">Elige tu avatar</h2>
//             <div className="grid grid-cols-3 gap-4">
//               {avatars.map((avatar) => (
//                 <Image
//                   key={avatar}
//                   src={avatar}
//                   alt="Avatar"
//                   className={`w-16 h-16 rounded-full cursor-pointer ${
//                     selectedAvatar === avatar ? "ring-4 ring-blue-500" : ""
//                   }`}
//                   onClick={() => handleAvatarChange(avatar)}
//                 />
//               ))}
//             </div>
//             <button
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
//               onClick={() => setIsModalOpen(false)}
//             >
//               Cancelar
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   ) : (
//     <div>
//       <Link href={"/auth/login"}>
//         <button className="p-2 bg-black text-white">LOG IN</button>
//       </Link>
//       <Link href={"/auth/signup"}>
//         <button className="p-2 border border-black">SIGN UP</button>
//       </Link>
//     </div>
//   );
// }
