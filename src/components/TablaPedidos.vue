<template>
  <b-container fluid class="mt-4">
    <h1 class="text-center mb-4">Lista de Pedidos</h1>

    <b-button
      class="btn btn-primary btn-md btn-alt mb-3"
      variant="primary"
      @click="$router.push('/')"
    >
      ⬅ Volver
    </b-button>

    <b-card class="p-3">
      <div class="table-responsive">
        <b-table
          striped
          hover
          responsive="true"
          :items="pedidos"
          :fields="fields"
          class="mt-4 tabla-responsive"
        >
          <!-- Columna de Adjuntos -->
          <template #cell(adjuntos)="row">
            <a
              v-if="row.item.adjuntos"
              :href="row.item.adjuntos"
              target="_blank"
              >Ver Archivo</a
            >
          </template>

          <!-- Columna de Estado (editable) -->
          <template #cell(estado)="row">
            <b-form-select
              v-model="row.item.estado"
              :options="['Pendiente', 'En Progreso', 'Terminado']"
              @change="actualizarEstado(row.item)"
              class="estado-select"
            >
              <template #first>
                <option disabled value="">Seleccione un estado</option>
              </template>
            </b-form-select>
          </template>

          <!-- Columna de Acciones -->
          <template #cell(acciones)="row">
            <div class="d-flex justify-content-center gap-2">
            <b-button
              size="sm"
              variant="warning"
              class="me-2 btn-alt"
              @click="editarPedido(row.item)"
            >
              Editar
            </b-button>
            <b-button
              size="sm"
              variant="danger"
              @click="abrirModalEliminar(row.item.id)"
            >
              Eliminar
            </b-button>
          </div>
          </template>
        </b-table>
      </div>
    </b-card>

    <!-- Modal de Confirmación de Estado -->
    <b-modal v-model="modalVisible" title="Estado Actualizado" hide-footer>
      <p class="text-center">
        El estado del pedido se ha actualizado correctamente.
      </p>
      <b-button
        variant="primary"
        class="d-block mx-auto"
        @click="modalVisible = false"
      >
        Aceptar
      </b-button>
    </b-modal>

    <!-- Modal de Confirmación de Eliminación -->
    <b-modal
      v-model="modalEliminarVisible"
      title="Confirmar Eliminación"
      hide-footer
    >
      <p class="text-center">
        ¿Estás segura de que quieres eliminar este pedido?
      </p>
      <div class="d-flex justify-content-center">
        <b-button variant="danger" class="me-2" @click="confirmarEliminarPedido"
          >Sí, eliminar</b-button
        >
        <b-button variant="secondary" @click="modalEliminarVisible = false"
          >Cancelar</b-button
        >
      </div>
    </b-modal>
  </b-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerPedidos, eliminarPedido } from '../services/pedidos';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import '../style.css';
import { nextTick } from "vue";

const pedidos = ref([]);
const router = useRouter();
const modalVisible = ref(false);
const modalEliminarVisible = ref(false);
const pedidoAEliminar = ref(null);

const fields = [
  { key: 'nombreCliente', label: 'Nombre del Cliente' },
  { key: 'idCliente', label: 'ID del Cliente' },
  { key: 'numeroPedido', label: 'Número de Pedido' },
  { key: 'objetivo', label: 'Objetivo' },
  { key: 'adjuntos', label: 'Adjuntos' },
  { key: 'estado', label: 'Estado' },
  { key: 'observaciones', label: 'Observaciones' },
  { key: 'acciones', label: 'Acciones' }
];

// Cargar pedidos desde Firestore
const cargarPedidos = async () => {
  try {
    let pedidosObtenidos = await obtenerPedidos();
    pedidos.value = pedidosObtenidos.map(pedido => ({
      ...pedido,
      estado: pedido.estado || 'Pendiente'
    }));
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
  }
};

// Editar pedido (redirigir con el ID)
const editarPedido = (pedido) => {
  if (!pedido || !pedido.id) {
    console.error("El pedido no tiene un ID válido:", pedido);
    return;
  }
  router.push({ path: '/', query: { id: pedido.id } });
};

// Abrir modal de confirmación de eliminación
const abrirModalEliminar = (id) => {
  pedidoAEliminar.value = id;
  modalEliminarVisible.value = true;
};

// Confirmar y eliminar el pedido
const confirmarEliminarPedido = async () => {
  if (!pedidoAEliminar.value) return;

  try {
    await eliminarPedido(pedidoAEliminar.value);
    await cargarPedidos();
    modalEliminarVisible.value = false;
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
  }
};

// Actualizar estado en Firebase y forzar la reactividad
const actualizarEstado = async (pedido) => {
  try {
    if (!pedido.id) {
      console.error("Error: No se encontró un ID válido para actualizar.", pedido);
      return;
    }

    // Esperar a que Vue actualice el `v-model`
    await nextTick();
    const pedidoRef = doc(db, "Pedidos", pedido.id);
    await updateDoc(pedidoRef, { estado: pedido.estado });
    // 🔄 Forzar la reactividad en Vue para reflejar el cambio
    pedidos.value = pedidos.value.map(p =>
      p.id === pedido.id ? { ...p, estado: pedido.estado } : p
    );
    // Mostrar el modal de confirmación
    modalVisible.value = true;
  } catch (error) {
    console.error("Error al actualizar el estado en Firebase:", error);
  }
};

// Cargar pedidos al montar el componente
onMounted(cargarPedidos);
</script>
