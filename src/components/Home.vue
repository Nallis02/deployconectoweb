<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Gestión de Pedidos</h1>

    <!-- Mensaje de éxito -->
    <b-alert v-if="mensajeExito" variant="success" show dismissible>
      {{ mensajeExito }}
    </b-alert>

    <!-- Formulario para agregar o editar pedidos -->
    <b-form @submit.prevent="manejarPedido" class="bg-light p-4 rounded shadow">
      <b-form-group label="Nombre del Cliente:" label-for="nombreCliente" class="mb-3">
        <b-form-input id="nombreCliente" v-model="nuevoPedido.nombreCliente" required></b-form-input>
      </b-form-group>

      <b-form-group label="ID del Cliente:" label-for="idCliente" class="mb-3">
        <b-form-input id="idCliente" v-model="nuevoPedido.idCliente" required></b-form-input>
      </b-form-group>

      <b-form-group label="Número de Pedido:" label-for="numeroPedido" class="mb-3">
        <b-form-input id="numeroPedido" v-model="nuevoPedido.numeroPedido" required></b-form-input>
      </b-form-group>

      <b-form-group label="Objetivo:" label-for="objetivo" class="mb-3">
        <b-form-textarea id="objetivo" v-model="nuevoPedido.objetivo" rows="3"></b-form-textarea>
      </b-form-group>

      <b-form-group label="Adjuntos:" label-for="adjuntos" class="mb-3">
        <input type="file" id="adjuntos" @change="seleccionarArchivo" class="form-control" />
      </b-form-group>

      <b-form-group label="Observaciones:" label-for="observaciones" class="mb-3">
        <b-form-textarea id="observaciones" v-model="nuevoPedido.observaciones" rows="3"></b-form-textarea>
      </b-form-group>

      <b-button type="submit" variant="primary" class="boton w-100">
        {{ editando ? "Actualizar Pedido" : "Agregar Pedido" }}
      </b-button>
    </b-form>

    <hr />
    <b-button class="btn-alt" variant="success" @click="verPedidosCargados">
      Ver Pedidos Cargados
    </b-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { agregarPedido, actualizarPedido, obtenerPedidoPorId } from '../services/pedidos';
import { storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter, useRoute } from 'vue-router';

const nuevoPedido = ref({
  nombreCliente: '',
  idCliente: '',
  numeroPedido: '',
  objetivo: '',
  adjuntos: '',
  observaciones: '',
  estado: 'pendiente'
});

const editando = ref(false);
const pedidoId = ref(null);
const archivo = ref(null);
const router = useRouter();
const route = useRoute();
const mensajeExito = ref(''); // ✅ Mensaje de éxito

// Función para redirigir a la página de pedidos
const verPedidosCargados = () => {
  router.push('/pedidos');
};

// Función para seleccionar el archivo
const seleccionarArchivo = (event) => {
  archivo.value = event.target.files[0] || null;
};

// Manejo de creación/actualización de pedidos
const manejarPedido = async () => {
  if (!nuevoPedido.value.nombreCliente || !nuevoPedido.value.idCliente || !nuevoPedido.value.numeroPedido) {
    console.warn("Faltan datos obligatorios");
    return;
  }

  let urlArchivo = '';

  try {
    if (archivo.value) {
      const archivoReferencia = storageRef(storage, `pedidos/${archivo.value.name}`);
      await uploadBytes(archivoReferencia, archivo.value);
      urlArchivo = await getDownloadURL(archivoReferencia);
    }

    const pedidoData = {
      ...nuevoPedido.value,
      adjuntos: urlArchivo || nuevoPedido.value.adjuntos
    };

    if (editando.value) {
      await actualizarPedido(pedidoId.value, pedidoData);
      mensajeExito.value = 'Pedido actualizado correctamente';
    } else {
      pedidoData.estado = 'pendiente'; // ✅ Asegurar que siempre sea 'pendiente' al crear
      await agregarPedido(pedidoData);
      mensajeExito.value = 'Pedido creado correctamente';
    }

    // Reiniciar formulario después de 3 segundos
    setTimeout(() => {
      mensajeExito.value = '';
      nuevoPedido.value = {
        nombreCliente: '',
        idCliente: '',
        numeroPedido: '',
        objetivo: '',
        adjuntos: '',
        observaciones: '',
        estado: 'pendiente' // ✅ Restablecer estado en el formulario
      };
      archivo.value = null;
      editando.value = false;
      pedidoId.value = null;
    }, 3000);
  } catch (error) {
    console.error('Error al manejar el pedido:', error);
  }
};


// Cargar datos del pedido si se está editando
onMounted(async () => {
  if (route.query.id) {
    pedidoId.value = route.query.id;
    editando.value = true;

    try {
      const pedido = await obtenerPedidoPorId(pedidoId.value);
      if (pedido) {
        nuevoPedido.value = { ...pedido };
      }
    } catch (error) {
      console.error("Error al cargar pedido para editar:", error);
    }
  }
});
</script>
