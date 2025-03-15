import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Obtener pedidos de Firestore
export const obtenerPedidos = async () => {
    const querySnapshot = await getDocs(collection(db, "Pedidos"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

export const agregarPedido = async (pedido) => {
    await addDoc(collection(db, 'Pedidos'), pedido);
};

export const eliminarPedido = async (id) => {
    await deleteDoc(doc(db, 'Pedidos', id));
};

export const actualizarPedido = async (id, pedido) => {
    const pedidoRef = doc(db, "Pedidos", id);
    await updateDoc(pedidoRef, pedido);
};

export const subirArchivo = async (archivo) => {
    if (!archivo) return null;

    try {
        const archivoRef = storageRef(storage, `pedidos/${archivo.name}`);
        await uploadBytes(archivoRef, archivo);
        return await getDownloadURL(archivoRef);
    } catch (error) {
        console.error("Error al subir archivo:", error);
        return null;
    }
};
export const obtenerPedidoPorId = async (id) => {
    try {
      if (!id) {
        console.warn("ID inválido:", id);
        return null;
      }
  
      console.log("Buscando en Firestore el pedido con ID:", id);
      const pedidoRef = doc(db, 'Pedidos', id); 
      const pedidoSnap = await getDoc(pedidoRef);
  
      if (pedidoSnap.exists()) {
        console.log("Pedido encontrado:", pedidoSnap.data());
        return { id: pedidoSnap.id, ...pedidoSnap.data() };
      } else {
        console.warn("Pedido no encontrado.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el pedido:", error);
      throw error;
    }
  };


